/**
 * Jira Integration Service
 * Reads Jira tickets and creates bugs for failed Playwright tests.
 *
 * Usage:
 * node jira/jiraService.js <command> [args]
 *
 * Commands:
 *   list-tickets
 *   get-ticket <KEY>
 *   update-status <KEY> <status>
 *   create-bug <json>
 *   setup          — Create all LMS Epics and Tasks (delegates to MCP)
 *   sync           — Show project status (delegates to MCP)
 *
 * See also: node mcp/index.js for the full MCP CLI.
 */

require('dotenv').config({
  path: require('path').join(__dirname, '../backend/.env')
});

const axios = require('axios');

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY || 'KAN';


if (!JIRA_BASE_URL || !JIRA_API_TOKEN) {
  console.error('Jira credentials not configured in backend/.env');
  process.exit(1);
}


// Jira Client
const client = axios.create({
  baseURL: `${JIRA_BASE_URL}/rest/api/3`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  auth: {
    username: JIRA_EMAIL,
    password: JIRA_API_TOKEN
  }
});


// ===============================
// LIST TICKETS
// ===============================

async function listOpenTickets() {

  const jql = `
    project = ${JIRA_PROJECT_KEY}
    AND status in ("To Do", "In Progress")
    ORDER BY created DESC
  `;


  const { data } = await client.post('/search/jql', {

    jql,

    maxResults: 50,

    fields: [
      'summary',
      'status',
      'issuetype',
      'priority',
      'assignee'
    ]

  });


  console.log(`\nOpen Tickets in ${JIRA_PROJECT_KEY}:\n`);


  if (!data.issues || data.issues.length === 0) {
    console.log("No tickets found.");
    return [];
  }


  data.issues.forEach(issue => {

    console.log(
      `${issue.key} | ${issue.fields.issuetype.name} | ${issue.fields.status.name} | ${issue.fields.summary}`
    );

  });


  return data.issues;
}



// ===============================
// GET SINGLE TICKET
// ===============================

async function getTicket(key) {


  const { data } = await client.get(`/issue/${key}`);


  console.log(`\n--- ${data.key} ---`);

  console.log(`Summary  : ${data.fields.summary}`);

  console.log(`Type     : ${data.fields.issuetype.name}`);

  console.log(`Status   : ${data.fields.status.name}`);

  console.log(
    `Priority : ${data.fields.priority?.name || 'N/A'}`
  );

  console.log(
    `Assignee : ${data.fields.assignee?.displayName || 'Unassigned'}`
  );


  return data;

}



// ===============================
// UPDATE STATUS
// ===============================

async function updateTicketStatus(key, transitionName) {


  const { data: transitionData } =
    await client.get(`/issue/${key}/transitions`);



  const transition =
    transitionData.transitions.find(
      t =>
        t.name.toLowerCase() ===
        transitionName.toLowerCase()
    );



  if (!transition) {

    console.error(
      `Transition "${transitionName}" not found.`
    );

    console.log(
      "Available:",
      transitionData.transitions.map(t => t.name)
    );

    return;
  }



  await client.post(
    `/issue/${key}/transitions`,
    {
      transition: {
        id: transition.id
      }
    }
  );



  console.log(
    `Ticket ${key} moved to "${transitionName}".`
  );

}



// ===============================
// CREATE BUG
// ===============================

async function createBug(bugData) {


  const {
    scenarioName,
    errorMessage,
    stackTrace,
    screenshotPath,
    executionTime
  } = bugData;



  const summary =
    `[AUTO][PLAYWRIGHT] Failed Scenario - ${scenarioName}`;



  // Check duplicate bug

  const jql =
    `project = ${JIRA_PROJECT_KEY}
     AND summary ~ "${scenarioName}"
     AND status != Done`;



  const { data: searchData } =
    await client.post('/search/jql', {

      jql,

      maxResults: 1,

      fields: [
        'summary'
      ]

    });



  if (searchData.issues?.length > 0) {

    console.log(
      `Duplicate bug found: ${searchData.issues[0].key}`
    );

    return searchData.issues[0].key;

  }




  const description = {


    version: 1,

    type: "doc",

    content: [


      {
        type: "heading",

        attrs: {
          level: 3
        },

        content: [
          {
            type: "text",
            text: "Automated Bug Report"
          }
        ]
      },


      {
        type: "paragraph",

        content: [
          {
            type: "text",
            text: `Scenario: ${scenarioName}`
          }
        ]

      },


      {
        type: "paragraph",

        content: [
          {
            type: "text",
            text: `Execution Time: ${executionTime}ms`
          }
        ]

      },


      {
        type: "codeBlock",

        attrs: {
          language: "text"
        },

        content: [
          {
            type: "text",
            text:
              `Error: ${errorMessage}\n\n${stackTrace || ''}`
          }
        ]

      },


      {
        type: "paragraph",

        content: [
          {
            type: "text",

            text:
              screenshotPath
              ? `Screenshot: ${screenshotPath}`
              : "No screenshot."
          }
        ]

      }


    ]

  };




  const { data } = await client.post(
    '/issue',
    {

      fields: {

        project: {
          key: JIRA_PROJECT_KEY
        },


        summary,


        description,


        issuetype: {
          name: "Task"
        },


        priority: {
          name: "High"
        },


        labels: [
          "automation",
          "playwright"
        ]

      }

    }
  );



  console.log(
    `Bug created: ${data.key}`
  );


  return data.key;

}



// ===============================
// COMMAND HANDLER
// ===============================

const [
  ,
  ,
  command,
  ...args
] = process.argv;



(async () => {


  try {


    switch(command) {


      case "list-tickets":

        await listOpenTickets();

        break;



      case "get-ticket":

        await getTicket(args[0]);

        break;



      case "update-status":

        await updateTicketStatus(
          args[0],
          args[1]
        );

        break;



      case "create-bug":

        await createBug(
          JSON.parse(args[0])
        );

        break;



      case "setup":
        require('../mcp/setupJira');
        break;

      case "sync": {
        const mcp = require('../mcp/mcpServer');
        const status = await mcp.sync_status();
        if (status) {
          console.log(`\nProject: ${status.projectKey}`);
          console.log(`Epics: ${status.totalEpics} | Tasks: ${status.totalTasks}`);
          console.log(`Done: ${status.done} | In Progress: ${status.inProgress} | To Do: ${status.todo}`);
          console.log(`Completion: ${status.completionPercent}%`);
        }
        break;
      }

      default:

        console.log(
          `
Usage:

node jira/jiraService.js list-tickets
node jira/jiraService.js get-ticket KAN-1
node jira/jiraService.js update-status KAN-1 Done
node jira/jiraService.js create-bug '{"scenarioName":"Login Test Failed"}'
node jira/jiraService.js setup
          `
        );

    }



  } catch(error) {


    console.error(
      "Jira error:",
      error.response?.data || error.message
    );


  }


})();