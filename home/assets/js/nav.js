// ハートスポットHP 共通ナビ（ハンバーガー開閉）。全ページ共通で読み込む。外部ライブラリ不使用。
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var willOpen = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', willOpen);
    toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  });

  // モバイルでリンクをタップしたらメニューを閉じる
  var links = nav.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function () {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }
})();
