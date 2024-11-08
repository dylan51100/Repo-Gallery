require('dotenv').config();
const express = require('express');
const { Octokit } = require('@octokit/rest');
const app = express();
const port = 3000;

//initialize octokit
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

const username= 'dylan51100';

async function getRepos(){
    try{
        const response = await octokit.request('Get /users/{username}/repos',{
            username,
        });
        return response.data;
    } catch(error){
        console.log('Error fectching repos:',error);
        return [];
    }
}

//set up route to display repositories

app.get('/', async (req, res) => {
    const repos = await getRepos();
    res.send(`
        <html>
        <head><title>My GitHub Repos</title></head>
        <body>
            <h1>Repositories of ${username}</h1>
            <ul>
            ${repos.map(
                (repo) =>
                `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>`
            ).join('')}
            </ul>
        </body>
        </html>
        `);
});

//start server

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})
