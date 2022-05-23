import { assertEquals } from "https://deno.land/std@0.92.0/testing/asserts.ts";


const serverPath = new URL("../server.ts", import.meta.url).href;

const baseUrl = "http://localhost:3000"

// Spawn the server in a worker thread
const worker = new Worker(serverPath, { type: "module", deno: {} })

// Wait for a moment to let the server start (this is a little hacky actually)
await new Promise((resolve) => setTimeout(resolve, 3000));

// Write our test cases, note that we store them in a variable
// This is necessary such that we can keep track of how many test are there
// And so we can terminate the server properly after every test finished
const tests: {
    name: string;
    fn: () => Promise<void>;
}[] = [
    {
        name: 'GET /api/todos should return array of todos',
        fn: async () => {
            const response = await fetch(baseUrl + "/api/todos");
            assertEquals(response.status, 200);
        }
    },
    {
        name: 'GET /api/huhu should return "404"',
        fn: async () => {
            const response = await fetch(baseUrl + "/api/huhu");
            assertEquals(response.status, 404);
        }
    },
    {
        name: 'GET /api/user/test should return "200"',
        fn: async () => {
            const response = await fetch(baseUrl + "/api/user/test");
            assertEquals(response.status, 200);
        }
    },
    {
        name: 'GET /favicon.ico should return "404"',
        fn: async () => {
            const response = await fetch(baseUrl + "/favicon.ico");
            assertEquals(response.status, 404);
        }
    }
]

// Utility function to keep track of number of ran tests
let numberOfRanTest = 0;
const done = () => {
    numberOfRanTest++;
    if (numberOfRanTest === tests.length) {
        worker.terminate();
    }
};

// Run the test
tests.forEach((test) => {
    Deno.test({
        name: test.name,

        // Note that we invoke `done` when the test fn finished
        fn: () => test.fn().then(done),

        // We need to set these options to false such that the test can exit with status 0
        sanitizeOps: false,
        sanitizeResources: false,
    });
});
