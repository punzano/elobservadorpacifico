let RouterModule = function() {
  let login_module;
  let home_module;
  let editor_module;

  let context = this;

  this.init = function() {
    page("/home", function(context, next) {
      login_module = null;
      editor_module = null;
      if(home_module)
        home_module.reload();
      else {
        home_module = new HomeModule();
        home_module.init();
      }
    });

    page("/incorrectAccount", function(context, next) {
      page("/login");
      showErrorModal();
    });

    page("/editor/:type/:id?", function(context, next) {
      login_module = null;
      home_module = null;
      editor_module = new EditorModule();
      if(editor_module.isInitialized())
        editor_module.init(context.params.id);
      else
        editor_module.reload(context.params.id);
    });

    page();
  }

  this.setModules = function(modules) {
    login_module = modules.login_module;
    home_module = modules.home_module;
    editor_module = modules.editor_module;
  }
}
