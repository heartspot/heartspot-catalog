// お知らせ欄レンダリング（news.html 専用）。news.json を掲載開始日/終了日で振り分ける。
// 終了日を過ぎたものは自動で「過去のお知らせ」に落とす。外部ライブラリ不使用。
(function () {
  var currentEl = document.getElementById('news-current');
  var pastDetails = document.getElementById('news-past');
  var pastList = document.getElementById('news-past-list');
  var emptyMsg = document.getElementById('news-empty');
  if (!currentEl) return;

  function formatDate(s) {
    var p = s.split('-');
    return p[0] + '年' + parseInt(p[1], 10) + '月' + parseInt(p[2], 10) + '日';
  }

  function renderItem(it) {
    var li = document.createElement('li');
    li.className = 'news-item';

    var date = document.createElement('p');
    date.className = 'news-item__date';
    date.textContent = formatDate(it.start) + (it.end ? '〜' + formatDate(it.end) : '');
    li.appendChild(date);

    var title = document.createElement('p');
    title.className = 'news-item__title';
    title.textContent = it.title;
    li.appendChild(title);

    if (it.body) {
      var body = document.createElement('p');
      body.className = 'news-item__body';
      body.textContent = it.body;
      li.appendChild(body);
    }
    return li;
  }

  fetch('news.json')
    .then(function (r) {
      if (!r.ok) throw new Error('news.json HTTP ' + r.status);
      return r.json();
    })
    .then(function (items) {
      var today = new Date();
      today.setHours(0, 0, 0, 0);

      var current = [];
      var past = [];

      items.forEach(function (it) {
        var start = new Date(it.start + 'T00:00:00');
        var end = new Date(it.end + 'T00:00:00');
        if (today < start) return; // 掲載開始日前はまだ出さない
        if (today > end) {
          past.push(it);
        } else {
          current.push(it);
        }
      });

      current.sort(function (a, b) { return new Date(b.start) - new Date(a.start); });
      past.sort(function (a, b) { return new Date(b.end) - new Date(a.end); });

      if (current.length === 0) {
        emptyMsg.hidden = false;
      } else {
        current.forEach(function (it) { currentEl.appendChild(renderItem(it)); });
      }

      if (past.length > 0 && pastDetails && pastList) {
        past.forEach(function (it) { pastList.appendChild(renderItem(it)); });
        pastDetails.hidden = false;
      }
    })
    .catch(function (err) {
      if (emptyMsg) {
        emptyMsg.hidden = false;
        emptyMsg.textContent = 'お知らせを読み込めませんでした。しばらくしてから再度お試しください。';
      }
      console.error('news.json load failed:', err);
    });
})();
