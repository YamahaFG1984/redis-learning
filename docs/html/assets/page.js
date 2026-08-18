(function () {
  var article = document.querySelector("article");

  /* ---- Wrap tables for horizontal scroll on small screens ---- */
  if (article) {
    article.querySelectorAll("table").forEach(function (table) {
      if (table.parentElement.classList.contains("table-wrap")) return;
      var wrap = document.createElement("div");
      wrap.className = "table-wrap";
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  }

  /* ---- Build right-hand "on this page" TOC from h2/h3 ---- */
  var tocList = document.getElementById("toc-list");
  if (article && tocList) {
    var headings = article.querySelectorAll("h2, h3");
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
      var anchor = document.createElement("a");
      anchor.className = "heading-anchor";
      anchor.href = "#" + h.id;
      anchor.textContent = "#";
      anchor.setAttribute("aria-hidden", "true");
      h.appendChild(anchor);

      var li = document.createElement("li");
      if (h.tagName === "H3") li.className = "toc-sub";
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent.replace(/#$/, "").trim();
      li.appendChild(a);
      tocList.appendChild(li);
    });

    var tocLinks = tocList.querySelectorAll("a");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.id;
          var link = tocList.querySelector('a[href="#' + id + '"]');
          if (!link) return;
          if (entry.isIntersecting) {
            tocLinks.forEach(function (l) {
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

  /* ---- Highlight current chapter in the left sidenav ---- */
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".sidenav-link").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === here) link.classList.add("active");
  });

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById("navToggle");
  var sidenav = document.getElementById("sidenav");
  var backdrop = document.getElementById("navBackdrop");
  function closeNav() {
    if (sidenav) sidenav.classList.remove("open");
    if (backdrop) backdrop.classList.remove("open");
  }
  if (toggle && sidenav) {
    toggle.addEventListener("click", function () {
      sidenav.classList.toggle("open");
      if (backdrop) backdrop.classList.toggle("open");
    });
  }
  if (backdrop) {
    backdrop.addEventListener("click", closeNav);
  }
  sidenav &&
    sidenav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });

  /* ---- Code blocks: language tag + copy button ---- */
  if (article) {
    article.querySelectorAll("pre").forEach(function (pre) {
      if (pre.parentElement.classList.contains("code-block")) return;
      var codeEl = pre.querySelector("code");
      var langMatch = codeEl && codeEl.className.match(/language-(\w+)/);
      var lang = langMatch ? langMatch[1] : "text";

      var wrap = document.createElement("div");
      wrap.className = "code-block";

      var header = document.createElement("div");
      header.className = "code-block-header";

      var dots = document.createElement("span");
      dots.className = "code-block-dots";
      dots.setAttribute("aria-hidden", "true");
      dots.innerHTML = "<i></i><i></i><i></i>";

      var langLabel = document.createElement("span");
      langLabel.className = "code-block-lang";
      langLabel.textContent = lang;

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-copy-btn";
      btn.textContent = "复制";
      btn.addEventListener("click", function () {
        var text = codeEl ? codeEl.textContent : pre.textContent;
        navigator.clipboard
          .writeText(text)
          .then(function () {
            btn.textContent = "已复制";
            setTimeout(function () {
              btn.textContent = "复制";
            }, 1500);
          })
          .catch(function () {});
      });

      header.appendChild(dots);
      header.appendChild(langLabel);
      header.appendChild(btn);

      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(header);
      wrap.appendChild(pre);
    });
  }

  /* ---- Mermaid diagrams, theme matched to color scheme ---- */
  if (window.mermaid) {
    var isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    window.mermaid.initialize({
      startOnLoad: true,
      theme: isDark ? "dark" : "default",
      securityLevel: "loose",
      flowchart: { htmlLabels: true, curve: "basis" },
    });
  }

  /* ---- Syntax highlighting ---- */
  if (window.hljs) {
    window.hljs.highlightAll();
  }
})();
