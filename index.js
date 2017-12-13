const GITHUB_SEARCH_URL = 'https://api.github.com/search/repositories';
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

const youtubeKey = "AIzaSyCAq3BR_9P-dfHlFxLUoTm_tf570UyzfyA";

function getDataFromApi(searchTerm, callback) {
  const settings = {
    url: YOUTUBE_SEARCH_URL,
    data: {
      part: "snippet",
      q: `${searchTerm}`,
      type: "video",
      key: youtubeKey
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };

  $.ajax(settings);
}

function renderResult(result) {
  // return `
  //   <div>
  //     <h2>
  //     <a class="js-result-name" href="${result.html_url}" target="_blank">${result.name}</a> by <a class="js-user-name" href="${result.owner.html_url}" target="_blank">${result.owner.login}</a></h2>
  //     <p>Number of watchers: <span class="js-watchers-count">${result.watchers_count}</span></p>
  //     <p>Number of open issues: <span class="js-issues-count">${result.open_issues}</span></p>
  //   </div>
  // `;

  return `
    <div>
      <h2>
      <a class="js-result-name">${result.snippet.title}</a></h2>
      <p>Description: <span class="js-watchers-count">${result.snippet.description}</span></p>
      <p>Channel Title: <span class="js-issues-count">${result.snippet["channelTitle"]}</span></p>
    </div>
  `;
}

function displayGitHubSearchData(data) {
  const results = data.items.map((item, index) => renderResult(item));
  //example of items sent out from data
  console.log(data.items[0]);
  console.log(data.items[0].snippet.title);
  console.log(data.items[0].snippet.channelId);
  console.log("~~~~~~~~");
  console.log(results);
  $('.js-search-results').html(results);
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // clear out the input
    // queryTarget.val("");
    getDataFromApi(query, displayGitHubSearchData);
  });
}

$(watchSubmit);
