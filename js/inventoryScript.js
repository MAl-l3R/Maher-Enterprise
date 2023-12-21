// Main Content
(function (global) {

  var maherenterprise = {};

  var inventoryJson = "data/inventory.json";
  var inventoryTitleHtmlUrl = "snippets/inventory-title-snippet.html";
  var inventoryItemHtmlUrl = "snippets/inventory-snippet.html";

  // Convenience function for inserting innerHTML for 'select'
  maherenterprise.insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    if (targetElem != null) {
      targetElem.innerHTML = html;
    }
  };

  // Show loading icon inside element identified by 'selector'.
  maherenterprise.showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    maherenterprise.insertHtml(selector, html);
  };

  // Return substitute of '{{propName}}'
  // with propValue in given 'string'
  maherenterprise.insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  // On page load (before images or CSS)
  document.addEventListener("DOMContentLoaded", function (event) {
    // Load the inventory view
    maherenterprise.showLoading("#main-content-inventory");
    $ajaxUtils.sendGetRequest(inventoryJson, buildAndShowInventoryHTML);
  });

  // Builds HTML for the inventory page based on the data
  // from the server
  function buildAndShowInventoryHTML(inventory) {
    maherenterprise.inventory = inventory;
    // Load title snippet of inventory page
    $ajaxUtils.sendGetRequest(
      inventoryTitleHtmlUrl,
      function (inventoryTitleHtml) {
        // Retrieve single inventory snippet
        $ajaxUtils.sendGetRequest(
          inventoryItemHtmlUrl,
          function (inventoryItemHtml) {
            var inventoryViewHtml = buildInventoryViewHtml(inventory, inventoryTitleHtml, inventoryItemHtml);
            maherenterprise.insertHtml("#main-content-inventory", inventoryViewHtml);
          },
          false
        );
      },
      false
    );
  }

  // Using all Inventory data and snippets html
  // build all Inventory view HTML to be inserted into page
  function buildInventoryViewHtml(
    inventory, 
    inventoryTitleHtml, 
    inventoryItemHtml) {

    var finalHtml = inventoryTitleHtml;
    finalHtml += "<section class='row'>";

    // Loop over all Inventory
    for (var i = 0; i < inventory.length; i++) {
      // Get the item's details
      var itemNo = inventory[i].itemNo;
      var name = inventory[i].year + " " + inventory[i].make  // year + make
      var price = inventory[i].price;
      
      // Inset the item's details into the view
      var html = inventoryItemHtml;
      html = maherenterprise.insertProperty(html, "itemNo", itemNo);
      html = maherenterprise.insertProperty(html, "name", name);
      html = maherenterprise.insertProperty(html, "price", price);

      // Add each inventory item to final inventory view html
      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }


  global.$maherenterprise = maherenterprise;

})(window);


  