(function () {
  "use strict";

  var DEFAULT_IMG = "images/john-afunwi-profile.jpg";

  var form = document.getElementById("form");
  var coursesDiv = document.getElementById("courses");
  var main = document.getElementById("main");
  var footerList = document.querySelector("footer ul");

  // Save the original course markup so Reset can restore it.
  var originalCourses = coursesDiv.innerHTML;

  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function escapeXml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function val(id) {
    return document.getElementById(id).value.trim();
  }

  // ---------- Courses ----------
  function courseHtml() {
    return '<legend>Course</legend>' +
      '<p><label>Department *<br>' +
      '<input type="text" class="department" value="" placeholder="Department (for example ITIS)" required></label></p>' +
      '<p><label>Number *<br>' +
      '<input type="text" class="courseNumber" value="" placeholder="Course number (for example 3135)" required></label></p>' +
      '<p><label>Name *<br>' +
      '<input type="text" class="courseTitle" size="50" value="" placeholder="Course name" required></label></p>' +
      '<p><label>Reason *<br>' +
      '<textarea class="reasonForTaking" rows="2" cols="70" placeholder="Why are you taking this course?" required></textarea></label></p>';
  }

  function addDeleteButton(fieldset) {
    if (fieldset.querySelector(".deleteCourse")) {
      return;
    }
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "deleteCourse";
    btn.textContent = "Delete Course";
    fieldset.appendChild(btn);
  }

  function addDeleteButtons() {
    var courses = coursesDiv.querySelectorAll(".course");
    for (var i = 0; i < courses.length; i++) {
      addDeleteButton(courses[i]);
    }
  }

  function addCourse() {
    var fieldset = document.createElement("fieldset");
    fieldset.className = "course";
    fieldset.innerHTML = courseHtml();
    coursesDiv.appendChild(fieldset);
    addDeleteButton(fieldset);
    fieldset.querySelector(".department").focus();
  }

  coursesDiv.addEventListener("click", function (e) {
    if (e.target.classList.contains("deleteCourse")) {
      e.target.closest(".course").remove();
    }
  });

  document.getElementById("addCourse").addEventListener("click", addCourse);
  addDeleteButtons();

  // ---------- Clear and Reset ----------
  document.getElementById("clearBtn").addEventListener("click", function () {
    var fields = form.querySelectorAll("input, textarea");
    for (var i = 0; i < fields.length; i++) {
      fields[i].value = "";
    }
  });

  form.addEventListener("reset", function () {
    // The browser restores field values; this restores the original course list.
    coursesDiv.innerHTML = originalCourses;
    addDeleteButtons();
  });

  // ---------- Submit ----------
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // prevents page refresh / default behavior

    if (!form.reportValidity()) {
      return;
    }

    var fileInput = document.getElementById("img");
    var file = fileInput.files && fileInput.files[0];

    if (file) {
      var reader = new FileReader();
      reader.onload = function () {
        showResult(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      showResult(DEFAULT_IMG);
    }
  });

  function field(label, text) {
    return '    <p><strong>' + label + ':</strong> ' + escapeHtml(text) + '</p>\n';
  }

  function buildIntroHtml(imgSrc) {
    var first = val("firstName");
    var middle = val("middleName");
    var nick = val("nickname");
    var last = val("lastName");
    var divider = val("prettyNameDivider");

    var fullName = first;
    if (middle) {
      fullName += " " + middle;
    }
    if (nick) {
      fullName += " '" + nick + "'";
    }
    fullName += " " + last;

    var html = '    <h2>Introduction Form</h2>\n';
    html += '    <h6>' + escapeHtml(fullName) + ' ' + escapeHtml(divider) + ' ' +
      escapeHtml(val("adjectives")) + ' ' + escapeHtml(val("animal")) + '</h6>\n';

    var imgTag = '<img src="' + escapeHtml(imgSrc) + '" alt="' + escapeHtml(val("pictureAlt")) + '" width="250">';
    var caption = val("caption");
    if (caption) {
      html += '    <figure>\n      ' + imgTag + '\n      <figcaption>' + escapeHtml(caption) + '</figcaption>\n    </figure>\n';
    } else {
      html += '    ' + imgTag + '\n';
    }
    html += '\n';

    var statement = val("statement");
    if (statement) {
      html += '    <p>' + escapeHtml(statement) + '</p>\n';
    }

    html += field("Personal Background", val("personalBackground"));
    html += field("Professional Background", val("professionalBackground"));
    html += field("Academic Background", val("academicBackground"));
    html += field("Primary Work Computer", val("primaryWorkComputer"));
    html += field("Primary Work Location", val("primaryWorkLocation"));
    html += field("Alternate Computer", val("alternateComputerLocation"));
    html += '\n';

    html += '    <p><strong>Courses I\'m Taking:</strong></p>\n    <ol>\n';
    var courses = coursesDiv.querySelectorAll(".course");
    for (var i = 0; i < courses.length; i++) {
      var c = courses[i];
      html += '      <li>' +
        escapeHtml(c.querySelector(".department").value.trim()) + ' ' +
        escapeHtml(c.querySelector(".courseNumber").value.trim()) + ', ' +
        escapeHtml(c.querySelector(".courseTitle").value.trim()) + '\n' +
        '        <ol>\n          <li>' +
        escapeHtml(c.querySelector(".reasonForTaking").value.trim()) +
        '</li>\n        </ol>\n      </li>\n';
    }
    html += '    </ol>\n\n';

    html += '    <blockquote>\n      "' + escapeHtml(val("quote")) + '"\n' +
      '      <p>- ' + escapeHtml(val("quoteAuthor")) + '</p>\n    </blockquote>\n';

    var funny = val("funnyItem");
    if (funny) {
      html += field("Funny Thing", funny);
    }
    var share = val("somethingToShare");
    if (share) {
      html += field("Something I Would Like to Share", share);
    }

    html += '\n    <p><a href="introduction_form.html">Reset</a></p>\n';
    return html;
  }

  function showResult(imgSrc) {
    main.innerHTML = buildIntroHtml(imgSrc);

    // Update the footer links with the submitted values.
    var labels = form.querySelectorAll(".linkLabel");
    var urls = form.querySelectorAll(".linkUrl");
    var links = "";
    for (var j = 0; j < labels.length; j++) {
      links += '      <li><a href="' + escapeHtml(urls[j].value.trim()) + '">' +
        escapeHtml(labels[j].value.trim()) + '</a></li>\n';
    }
    footerList.innerHTML = "\n" + links + "    ";

    window.scrollTo(0, 0);
  }

  // ---------- Generate HTML / JSON / XML ----------
  function currentImgSrc() {
    var fileInput = document.getElementById("img");
    var file = fileInput.files && fileInput.files[0];
    return file ? "images/" + file.name : DEFAULT_IMG;
  }

  function collectData() {
    var data = {
      firstName: val("firstName"),
      middleName: val("middleName"),
      nickname: val("nickname"),
      lastName: val("lastName"),
      acknowledgment: val("acknowledgment"),
      acknowledgmentDate: val("acknowledgmentDate"),
      prettyNameDivider: val("prettyNameDivider"),
      adjectives: val("adjectives"),
      animal: val("animal"),
      img: currentImgSrc(),
      pictureAlt: val("pictureAlt"),
      caption: val("caption"),
      personalInfo: {
        statement: val("statement"),
        personalBackground: val("personalBackground"),
        professionalBackground: val("professionalBackground"),
        academicBackground: val("academicBackground"),
        primaryWorkComputer: val("primaryWorkComputer"),
        primaryWorkLocation: val("primaryWorkLocation"),
        alternateComputerLocation: val("alternateComputerLocation")
      },
      courses: [],
      quote: val("quote"),
      quoteAuthor: val("quoteAuthor"),
      funnyItem: val("funnyItem"),
      somethingToShare: val("somethingToShare"),
      footerLinks: []
    };

    var courses = coursesDiv.querySelectorAll(".course");
    for (var i = 0; i < courses.length; i++) {
      var c = courses[i];
      data.courses.push({
        department: c.querySelector(".department").value.trim(),
        number: c.querySelector(".courseNumber").value.trim(),
        name: c.querySelector(".courseTitle").value.trim(),
        reason: c.querySelector(".reasonForTaking").value.trim()
      });
    }

    var labels = form.querySelectorAll(".linkLabel");
    var urls = form.querySelectorAll(".linkUrl");
    for (var j = 0; j < labels.length; j++) {
      data.footerLinks.push({
        label: labels[j].value.trim(),
        url: urls[j].value.trim()
      });
    }
    return data;
  }

  function tag(name, text, indent) {
    return indent + "<" + name + ">" + escapeXml(text) + "</" + name + ">\n";
  }

  function buildXml(d) {
    var p = d.personalInfo;
    var x = '<?xml version="1.0" encoding="UTF-8"?>\n<introductionData>\n';
    x += tag("firstName", d.firstName, "  ");
    x += tag("middleName", d.middleName, "  ");
    x += tag("nickname", d.nickname, "  ");
    x += tag("lastName", d.lastName, "  ");
    x += tag("acknowledgment", d.acknowledgment, "  ");
    x += tag("acknowledgmentDate", d.acknowledgmentDate, "  ");
    x += tag("prettyNameDivider", d.prettyNameDivider, "  ");
    x += tag("adjectives", d.adjectives, "  ");
    x += tag("animal", d.animal, "  ");
    x += tag("img", d.img, "  ");
    x += tag("pictureAlt", d.pictureAlt, "  ");
    x += tag("caption", d.caption, "  ");
    x += "  <personalInfo>\n";
    x += tag("statement", p.statement, "    ");
    x += tag("personalBackground", p.personalBackground, "    ");
    x += tag("professionalBackground", p.professionalBackground, "    ");
    x += tag("academicBackground", p.academicBackground, "    ");
    x += tag("primaryWorkComputer", p.primaryWorkComputer, "    ");
    x += tag("primaryWorkLocation", p.primaryWorkLocation, "    ");
    x += tag("alternateComputerLocation", p.alternateComputerLocation, "    ");
    x += "  </personalInfo>\n";
    x += "  <courses>\n";
    for (var i = 0; i < d.courses.length; i++) {
      x += "    <course>\n";
      x += tag("department", d.courses[i].department, "      ");
      x += tag("number", d.courses[i].number, "      ");
      x += tag("name", d.courses[i].name, "      ");
      x += tag("reason", d.courses[i].reason, "      ");
      x += "    </course>\n";
    }
    x += "  </courses>\n";
    x += tag("quote", d.quote, "  ");
    x += tag("quoteAuthor", d.quoteAuthor, "  ");
    x += tag("funnyItem", d.funnyItem, "  ");
    x += tag("somethingToShare", d.somethingToShare, "  ");
    x += "  <footerLinks>\n";
    for (var j = 0; j < d.footerLinks.length; j++) {
      x += "    <link>\n";
      x += tag("label", d.footerLinks[j].label, "      ");
      x += tag("url", d.footerLinks[j].url, "      ");
      x += "    </link>\n";
    }
    x += "  </footerLinks>\n";
    x += "</introductionData>\n";
    return x;
  }

  function showOutput(title, text) {
    var out = document.getElementById("output");
    if (!out) {
      out = document.createElement("section");
      out.id = "output";
      main.appendChild(out);
    }
    out.innerHTML = "";

    var heading = document.createElement("h3");
    heading.textContent = title;
    out.appendChild(heading);

    var label = document.createElement("label");
    label.setAttribute("for", "outputText");
    label.textContent = title + " code";
    out.appendChild(label);
    out.appendChild(document.createElement("br"));

    var area = document.createElement("textarea");
    area.id = "outputText";
    area.readOnly = true;
    area.rows = 24;
    area.cols = 90;
    area.value = text;
    out.appendChild(area);

    out.scrollIntoView();
  }

  function generate(kind) {
    if (!form.reportValidity()) {
      return;
    }
    if (kind === "html") {
      showOutput("Generated HTML", buildIntroHtml(currentImgSrc()));
    } else if (kind === "json") {
      showOutput("Generated JSON", JSON.stringify(collectData(), null, 2));
    } else {
      showOutput("Generated XML", buildXml(collectData()));
    }
  }

  document.getElementById("genHtml").addEventListener("click", function () { generate("html"); });
  document.getElementById("genJson").addEventListener("click", function () { generate("json"); });
  document.getElementById("genXml").addEventListener("click", function () { generate("xml"); });
})();