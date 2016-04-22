// See http://en.wikipedia.org/wiki/Comma-separated_values
/* global $ _ localStorage */
(() => {
"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

const buttonsCsv = `
<div class="contenido">
    <% _.each(csvFiles, (csvfile) => { %>
        <button class="btn-load" type="button"><%= csvfile %></button>
    <% }); %>
</div>
`;


const resultTemplate = `
<div class="contenido">
      <table class="center" id="result">
          <% _.each(rows, (row) => { %>
          <tr class="<%=row.type%>">
              <% _.each(row.items, (name) =>{ %>
              <td><%= name %></td>
              <% }); %>
          </tr>
          <% }); %>
      </table>
  </p>
</div>
`;


class App {
  constructor() {
    this.getCSVs();

    $('#saveBtn').click(() => {
      this.saveCSVWithName($('#fileName').val())
      .done(()=> { // Esperamos por los datos entonces se actualiza
        $('#fileName').val('');
        this.getCSVs();
      });
    });
  }
  
  /**
   * Fill file buttons in html, this buttons represents files in db to load
   * its get array of name
   */
  fillFileButtons(csvFiles) { // [String] -> IO ()
    $('#specific_buttons').html(_.template(buttonsCsv, { csvFiles: csvFiles}));
  }
  
  /**
   * Fill csvTable in html section final table
   * its get Object with rows
   */
  fillTable(data) { // { rows: [{??? status: ??? }] } -> IO ()
    $("#finaltable").html(_.template(resultTemplate, { rows: data.rows })); 
  };
  
  /**
   * Get CSVs tables from server a fill table
   */
  getCSVs() { // IO ()
    $.get('/getCsvs', {}, (data) => {
      console.log("mis datos" + data.csvFiles);
      this.fillFileButtons(data.csvFiles);
    }, 'json')
    .done(() => { // Debemos actualizar los handlers de evento
      $('button.btn-load').each((ix,elem) => {
        console.log("pufff")
        $(elem).click(() => {
          console.log($(elem).html());
          this.getCSVFile($(elem).html());
        });
      })
    });
  };
  
  /**
   * Load CSV from server
   */
   getCSVFile(filename) {
     $.get('/getCsvfile', { csvfile: filename }, (data) => {
       console.log(data);
       $("#original").val(data.content);
     }, 'json');
   }
  
  /**
   * save a value with a specified name and take data(csv contents) from html
   * and save over db
   */
  saveCSVWithName(name) { // String -> IO ()
    let data = $("#original").val();
    return $.get('/sendCsvfile', {name: name, csv: data}, 'json');
  };
}


/* Volcar la tabla con el resultado en el HTML */
const fillTable = (data) => { 
  $("#finaltable").html(_.template(resultTemplate, { rows: data.rows })); 
};

/* Volcar en la textarea de entrada 
 * #original el contenido del fichero fileName */
const dump = (fileName) => {
  $.get(fileName, function (data) {
      $("#original").val(data);
  });
};
 
const handleFileSelect = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();

 var files = evt.target.files; 

  var reader = new FileReader();
  reader.onload = (e) => {
  
    $("#original").val(e.target.result);
  };
  reader.readAsText(files[0])
}

/* Drag and drop: el fichero arrastrado se vuelca en la textarea de entrada */
const handleDragFileSelect = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.

  var reader = new FileReader();
  reader.onload = (e) => {
  
    $("#original").val(e.target.result);
    evt.target.style.background = "white";
  };
  reader.readAsText(files[0])
}

const handleDragOver = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();
  evt.target.style.background = "yellow";
}

$(document).ready(() => {
    let original = document.getElementById("original");  
    if (window.localStorage && localStorage.original) {
      original.value = localStorage.original;
    }
    $("#parse").click( () => {
        if (window.localStorage) localStorage.original = original.value;
        $.get("/csv", /* Request AJAX para que se calcule la tabla */
          { input: original.value }, 
          fillTable,
          'json'
        );
   });
   /* botones para rellenar el textarea */
   $('button.example').each( (_,y) => {
     $(y).click( () => { dump(`${$(y).text()}.txt`); });
   });

    new App();

    // Setup the drag and drop listeners.
    //var dropZone = document.getElementsByClassName('drop_zone')[0];
    let dropZone = $('.drop_zone')[0];
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleDragFileSelect, false);
    let inputFile = $('.inputfile')[0];
    inputFile.addEventListener('change', handleFileSelect, false);
 });
})();

