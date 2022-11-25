const formatTablePage = (title, columns, data, options) => {
  let headers = "";
  columns.forEach((c) => {
    headers += `<th>${c.label}</th>`;
  });

  let content = "";
  data.forEach((r) => {
    let cells = "";
    columns.forEach((c) => {
      cells += `<td>${r[c.field]}</td>`;
    });
    content += `<tr>${cells}</tr>`;
  });

  console.log(options);
  const optionsString = JSON.stringify(options);
  console.log(optionsString);

  return `
<html>
<head>
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.1/css/jquery.dataTables.min.css">
<script
  src="https://code.jquery.com/jquery-3.6.1.min.js"
  integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ="
  crossorigin="anonymous"></script>
<script src="https://cdn.datatables.net/1.13.1/js/jquery.dataTables.min.js"></script>
</head>
<body>
<h1>${title}</h1>
<table id="myTable">
<thead>
<tr>${headers}</tr>
</thead>
<tbody>
${content}
</tbody>
</table>

<script>
$(document).ready( function () {
    $('#myTable').DataTable(${optionsString});
} );
</script>
</body>
</html>
    `;
};

const _padTo2Digits = function (num) {
  return num.toString().padStart(2, "0");
};

const getTodayString = function () {
  const date = new Date();
  const output = [date.getFullYear(), _padTo2Digits(date.getMonth() + 1), _padTo2Digits(date.getDate())].join("");
  return output;
};

module.exports = { formatTablePage, getTodayString };
