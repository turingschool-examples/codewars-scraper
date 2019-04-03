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
        const numKataCompleted = stats.find(stat => stat.innerText.includes('Total Completed Kata')).innerText;

        return {username, numKataCompleted};
      })
      .end();

      return result;
  } catch(e) {
    console.error(e);
  }
};

console.log(`Scraping katas...`);

// const data = studentKataURLs.reduce(async (acc, pageLink, idx) => {
//   const dataArray = await acc;
//   const {username, numKataCompleted} = await goToPageAndGetData(pageLink);

//   console.log(`${username}: ${numKataCompleted}`);
//   dataArray.push(numKataCompleted);
//   return dataArray;
// }, Promise.resolve([]));

studentKataURLs.forEach(async (pageLink) => {
  const {username, numKataCompleted} = await goToPageAndGetData(pageLink);

  console.log(`${username}: ${numKataCompleted}`);
});

