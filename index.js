const PORT = 8000;

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const app = express();

const URL = "https://www.animatetimes.com/tag/details.php?id=5947";

async function searchLinks(title) {
  const browser = await puppeteer.launch({headless: true, executablePath: "C:\Users\Public\Desktop\Google Chrome.lnk"});
  const page = await browser.newPage();

  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(title)}`;
  await page.goto(searchUrl);

  const firstLink = await page.evaluate(() => {
    const firstResult = document.querySelector("a");
    return firstResult ? firstResult.href : null;
  });

  console.log("link", firstLink);

  await browser.close();
}

axios(URL)
  .then((response) => {
    const htmlParser = response.data;
    const $ = cheerio.load(htmlParser);
    const titles = [];
    const schedules = [];

    $(".tag-content").each(function() {
      $(this).find("td").each(function() {
        if ($(this).text().includes("作品名")) {
          const title = $(this).siblings("th").text();
          titles.push(title);
        } else if ($(this).text().includes("スケジュール")){
          const schedule = $(this).siblings("th").text();
          schedules.push(schedule);
        }
      });
    });
    titles.map(async (element, index) => {
      console.log("title: " + element);
      console.log("schedule: " + schedules[index]);

      await searchLinks(element);
    });
  });


app.listen(PORT, () => console.log("server running on port", PORT));

