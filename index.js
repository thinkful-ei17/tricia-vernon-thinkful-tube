'use strict';
/*global $*/

const GITHUB_SEARCH_URL = 'https://api.github.com/search/repositories';
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

const youtubeKey = 'AIzaSyCAq3BR_9P-dfHlFxLUoTm_tf570UyzfyA';
const STORE = {
  next: '',
  prev: '',
  searchTerm: ''
};

function getDataFromApi(searchTerm, callback) {
  const settings = {
    url: YOUTUBE_SEARCH_URL,
    data: {
      part: 'snippet',
      q: `${searchTerm}`,
      type: 'video',
      key: youtubeKey
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };

  $.ajax(settings);
}

function getNextDataFromApi(searchTerm, nextPageToken, callBack) {
  const settings = {
    url: YOUTUBE_SEARCH_URL,
    data: {
      part: 'snippet',
      q: `${searchTerm}`,
      type: 'video',
      key: youtubeKey,
      pageToken: nextPageToken
    },
    dataType: 'json',
    type: 'GET',
    success: callBack,

  };

  $.ajax(settings);
}

function getPrevDatafromApi(searchTerm, prevPageToken, callBack) {
  const settings = {
    url: YOUTUBE_SEARCH_URL,
    data: {
      part: 'snippet',
      q: `${searchTerm}`,
      type: 'video',
      key: youtubeKey,
      pageToken: prevPageToken
    },
    dataType: 'json',
    type: 'GET',
    success: callBack
  };

  $.ajax(settings);
}

function renderResult(result) {
  // return `
  //   <div>
  //     <h2>
  //     <a class="js-result-name" href="${result.snippet.title}" target="_blank">${result.name}</a> by <a class="js-user-name" href="${result.owner.html_url}" target="_blank">${result.owner.login}</a></h2>
  //     <p>Number of watchers: <span class="js-watchers-count">${result.watchers_count}</span></p>
  //     <p>Number of open issues: <span class="js-issues-count">${result.open_issues}</span></p>
  //   </div>
  // `;

  return `
    <div>
      <h2>
      <a class="js-result-name">${result.snippet.title}</a></h2>
      <p>Description: <span class="js-watchers-count">${result.snippet.description}</span></p>
      <p>Channel Title: <a href="https://www.youtube.com/channel/${result.snippet.channelId}" target="_blank"><span class="js-issues-count">${result.snippet.channelTitle}</span></p>
      </a>
      <a href="https://www.youtube.com/watch?v=${result.id.videoId}" target="_blank"><img src="${result.snippet.thumbnails.high.url}"></img></a>
    </div>
  `;
}

function handleNextPage() {
  $('.next').on('click', event => {
    console.log('handleNextPage');
    if (STORE.next) {
      getNextDataFromApi(STORE.searchTerm, STORE.next, displayYouTubeSearchData);
    }
  });
}

function handlePreviousPage() {
  $('.prev').on('click', event => {
    console.log('handlePrevPage');
    if (STORE.prev) {
      getPrevDatafromApi(STORE.searchTerm, STORE.prev, displayYouTubeSearchData);
    }
  });
}


function displayYouTubeSearchData(data) {
  const results = data.items.map((item, index) => renderResult(item));
  //example of items sent out from data
  //testing
  console.log(data.items[0]);
  console.log(data.items[0].snippet.title);
  console.log(data.items[0].snippet.channelId);
  console.log('TITLE:');
  console.log(data.items[0].snippet.channelTitle);
  console.log('!!!!!!!!');
  console.log(data.items[0].snippet.thumbnails['default']);
  console.log('~~~~~~~~');
  console.log(data.items[0].snippet.thumbnails.default);
  console.log('NEXT and PREV Token');
  console.log(data.nextPageToken);
  console.log(data.prevPageToken);
  console.log(results);

  if (data.nextPageToken) {
    STORE.next = data.nextPageToken;
    console.log(STORE.next);
  }
  if (data.prevPageToken) {
    STORE.prev = data.prevPageToken;
    console.log(STORE.prev);
  }
  $('.js-search-results').html(results);

}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // clear out the input
    // queryTarget.val("");
    getDataFromApi(query, displayYouTubeSearchData);
    STORE.searchTerm = query;
  });
}

$(watchSubmit);
$(handleNextPage);
$(handlePreviousPage);