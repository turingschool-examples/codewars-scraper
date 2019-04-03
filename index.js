const Nightmare = require('nightmare');

const studentKataURLs = require('./students.js');

const goToPageAndGetData = async (pageLink) => {
  try {
    const nightmare = new Nightmare({ show: false });

    const result = await nightmare
      .goto(pageLink)
      .wait('#shell_content')
      .evaluate(() => {
        const username = document.location.href.split('/').pop();

        const stats = [...document.querySelectorAll('.stat-container .stat-box .stat')];
        const kataCompletedText = stats.find(stat => stat.innerText.includes('Total Completed Kata')).innerText;
        const numKataCompleted = kataCompletedText.split(':').pop();

        return {username, numKataCompleted};
      })
      .end();

      return result;
  } catch(e) {
    console.error(e);
  }
};

console.log(`Scraping katas...`);

const runScraper = async () => {
  for (const pageLink of studentKataURLs) {
    const {username, numKataCompleted} = await goToPageAndGetData(pageLink);

    console.log(`${username}: ${numKataCompleted}`);
  }  
}

runScraper()
  .then(() => console.log('Finished.'))
  .catch(err => console.error(err));
