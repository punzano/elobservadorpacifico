page("/", function(context, next) {
  page.redirect("/ultimas-entradas");
});

page("/ultimas-entradas", function(context, next) {
  loadCategories();
  setActiveOption(context.path);
  loadLastEntries();
});

page("/sobre-mi", function(context, next) {
  loadCategories();
  setActiveOption(context.path);
  loadHtml("about_me");
});

page('/entrada/:entryID', function(context, next) {
  loadCategories();
  renderPost(context.params.entryID);
});

page('*', function(context, next) {
  loadCategories();
  let active_option = setActiveOption(context.path);
  loadCategoryEntries(active_option);
});

page();
