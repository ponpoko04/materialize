var index = function () {
  //localStorageにあればそちらのデータで初期化
  var todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [[], [], []];
  if (!Array.isArray(todos[0])) {
    //2次元配列でなかった旧バージョン対応のため、2次元配列化します
    todos = [todos, [], []];
  }

  function getUniqueStr(myStrong) {
    var strong = 1000;
    if (myStrong) strong = myStrong;
    return new Date().getTime().toString(16) + Math.floor(strong * Math.random()).toString(16)
  }

  function getSelectedTaskGroup() {
    return $('select.task-group').val();
  }

  function refreshTodoList() {
    var todoHtml = '';
    var selectedGroup = $('select.task-group').val();
    for (var i = 0; i < todos[selectedGroup].length; i++) {
      todoHtml += '<div><p>';
      todoHtml += '<input type="checkbox" id="' + todos[selectedGroup][i].id + '" class="filled-in" ';
      todoHtml += 'onchange="index.changeTodo(\'' + todos[selectedGroup][i].id + '\');" ';
      todoHtml += (todos[selectedGroup][i].checked ? 'checked="checked" />' : '/>');
      todoHtml += '<label for="' + todos[selectedGroup][i].id + '">' + todos[selectedGroup][i].name + '</label></p></div>';
    }
    $('#list').html(todoHtml);
    return;
  }

  function clearTodoInput() {
    $('#todoInput').val('');
    return;
  }

  return {
    popTodo: function (id) {
      var selectedGroup = getSelectedTaskGroup();
      for (var i; i < todos[selectedGroup].length; i++) {
        if (todos[selectedGroup][i].id === id) {
          todos[selectedGroup].splice(i + 1, 1);
          break;
        }
      }
      this.saveTodos();
    },
    popAll: function () {
      var selectedGroup = getSelectedTaskGroup();
      todos[selectedGroup] = [];
      this.saveTodos();
      refreshTodoList();
    },
    pushTodo: function (e, name) {
      if (e.key !== 'Enter') {
        return;
      }
      var selectedGroup = getSelectedTaskGroup();
      todos[selectedGroup].push({ id: getUniqueStr(), name: name });
      this.saveTodos();
      refreshTodoList();
      clearTodoInput();
    },
    changeTodo: function (id) {
      var selectedGroup = getSelectedTaskGroup();
      todos[selectedGroup] = todos[selectedGroup].map(function (i) {
        if (i.id === id) {
          i.checked = $('#' + id).prop('checked');
        }
        return i;
      });
      this.saveTodos();
    },
    showTodoList: function () {
      refreshTodoList();
    },
    getTodoList: function () {
      var selectedGroup = getSelectedTaskGroup();
      return todos[selectedGroup];
    },
    saveTodos: function () {
      try {
        localStorage.setItem('todos', JSON.stringify(todos));
      } catch (e) {
        return 'Exception Occured. Could not save todos.';
      }
    }
  };
}();

$(function () {
  index.showTodoList();
  $('.progress').hide();
  $('input').on('keydown', function (e) {
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
      return false;
    }
    return true;
  });

  //materialize initialize
  $('select').material_select();

  $('select').off('change').on('change', function () {
    index.showTodoList();
  });
});
$(window).on('beforeunload', function(e) {
  return index.saveTodos();
});
