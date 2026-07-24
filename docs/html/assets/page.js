(function () {
  // Build right-hand "on this page" TOC from h2/h3 inside <main>
  var main = document.querySelector("main");
  var tocList = document.getElementById("toc-list");
  if (main && tocList) {
    var headings = main.querySelectorAll("h2, h3");
    headings.forEach(function (h, i) {
      if (!h.id) {
        h.id =
          "sec-" +
          i +
          "-" +
          h.textContent
            .trim()
            .toLowerCase()
            .replace(/[^\w一-龥]+/g, "-")
            .replace(/^-+|-+$/g, "");
      }
      var li = document.createElement("li");
      if (h.tagName === "H3") li.className = "toc-sub";
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      tocList.appendChild(li);
    });

    var links = tocList.querySelectorAll("a");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.id;
          var link = tocList.querySelector('a[href="#' + id + '"]');
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach(function (l) {
              l.classList.remove("active");
            });
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "0px 0px -70% 0px" }
    );
    headings.forEach(function (h) {
      observer.observe(h);
    });
  }

  // Mermaid diagrams, theme matched to color scheme
  if (window.mermaid) {
    var isDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    window.mermaid.initialize({
      startOnLoad: true,
      theme: isDark ? "dark" : "default",
      securityLevel: "loose",
      flowchart: { htmlLabels: true, curve: "basis" },
    });
  }

  // Syntax highlighting
  if (window.hljs) {
    window.hljs.highlightAll();
  }
})();
