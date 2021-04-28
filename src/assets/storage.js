var localStorageBackup = function() {
  if(window.confirm('Deseja fazer download dos seus dados?')) {
    var backup = {};
    for (i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      var value = localStorage.getItem(key);
      backup[key] = escape(encodeURIComponent(value));
    }
    var json = JSON.stringify(backup);
    var base = btoa(json);
    var href = 'data:text/javascript;charset=utf-8;base64,' + base;
    var link = document.createElement('a');
      link.setAttribute('download', 'dados_financas.json');
    link.setAttribute('href', href);
    document.querySelector('body').appendChild(link);
    link.click();
    link.remove();
  }
};

var localStorageRestore = function() {
  var t = document.createElement('div');
  var a = document.createElement('a');
  a.appendChild(document.createTextNode('X'));
  a.setAttribute('href', 'javascript:null');

  a.style.position = 'absolute';
  a.style.top = '10px';
  a.style.right = '10px';
  a.style['text-decoration'] = 'none';
  a.style.color = '#fff';
  t.appendChild(a);
  a.onclick = function() {
      t.remove();
  };
  t.style.width = '50%';
  t.style.position = 'absolute';
  t.style.top = '25%';
  t.style.left = '25%';
  t.style['background-color'] = 'gray';
  t.style['text-align'] = 'center';
  t.style.padding = '50px';
  t.style.color = '#fff';
  t.style['z-index'] = 10000;

  var l = document.createElement('input');
  l.setAttribute('type', 'file');
  l.setAttribute('id', 'fileinput');
  l.onchange = function(e) {
      t.remove();
      var f = e.target.files[0];
      if (f) {
          var reader = new FileReader();
          reader.onload = function(e) {
              var text = e.target.result;
              var backup = JSON.parse(text);
              for (var key in backup){
                 var value = decodeURIComponent(unescape(backup[key]));
                 window.localStorage.setItem(key, value);
               }
              alert('Foram importados ' + Object.keys(backup).length + ' itens do backup.')
          };
          reader.readAsText(f);
          window.location.reload();
      } else {
        alert('Falha ao carregar arquivo');
      }
  };
  var a = document.createElement('h3');
  a.style['margin-top'] = '5px';
  a.style['margin-bottom'] = '30px';
  a.appendChild(document.createTextNode('Selecione o arquivo de backup'));
  t.appendChild(a);
  t.appendChild(l);
  document.querySelector('body').appendChild(t);
};

var localStorageClear = function() {
  if(window.confirm('Deseja realmente excluir todos os seus dados salvos?')) {
    localStorage.clear();
    window.location.reload();
  }
}
