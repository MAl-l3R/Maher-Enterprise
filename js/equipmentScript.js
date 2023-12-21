// Main Content
(function (global) {

    var inventoryJson = "data/inventory.json";
    var carouselIndicatorSnippetHtmlUrl = "snippets/carousel-indicator-snippet.html";
    var carouselImgSnippetHtmlUrl = "snippets/carousel-img-snippet.html";
    var equipmentSnippetHtmlUrl = "snippets/equipment-snippet.html";
  
    // On page load (before images or CSS)
    document.addEventListener("DOMContentLoaded", function (event) {
      // Retrieve the item number
      var urlParams = new URLSearchParams(window.location.search);
      var itemNoString = urlParams.get('itemNo');
      var itemNo = parseInt(itemNoString, 10);

      // Load the inventory
      $maherenterprise.showLoading("#main-content-equipment");
      $ajaxUtils.sendGetRequest(inventoryJson, function (inventory) {loadEquipment(inventory, itemNo);});
    });

    function loadEquipment (inventory, itemNo) {
      // Load the equipment view
      var equipment = inventory[itemNo - 1];

      $ajaxUtils.sendGetRequest(
        carouselIndicatorSnippetHtmlUrl, 
        function(carouselIndicatorSnippetHtml) {
          $ajaxUtils.sendGetRequest(
            carouselImgSnippetHtmlUrl, 
            function(carouselImgSnippetHtml) {
              $ajaxUtils.sendGetRequest(
                equipmentSnippetHtmlUrl, 
                function(equipmentSnippetHtml) {
                  var equipmentViewHtml = buildEquipmentViewHtml(
                    equipment, 
                    carouselIndicatorSnippetHtml, 
                    carouselImgSnippetHtml,
                    equipmentSnippetHtml
                    );
                  $maherenterprise.insertHtml("#main-content-equipment", equipmentViewHtml);
                },
                false);
            },
            false);
        },
        false);
    }
  
    function buildEquipmentViewHtml(
      equipment, 
      carouselIndicatorSnippetHtml, 
      carouselImgSnippetHtml,
      equipmentSnippetHtml
      ) {
        // First, get all equipment details
        var itemNo = equipment.itemNo;
        var category = equipment.category;
        var make = equipment.make;
        var model = equipment.model;
        var year = equipment.year;
        var price = equipment.price;
        var serialNumber = equipment.serialNumber;
        var condition = equipment.condition;
        var stock = equipment.stock;
        var vin = equipment.vin;
        var pictures = equipment.pictures;
        var name = year + " " + make + " " + model + " " + category;
  
        // Next, create all the carousel indicator html and carousel image html
        var allCarouselIndicatorHtml = "";
        var allCarouselImgHtml = "";
        for (var i = 0; i < pictures; i++) {
          var pictureNo = i + 1;
  
          var indicatorHtml = carouselIndicatorSnippetHtml;
          indicatorHtml = $maherenterprise.insertProperty(indicatorHtml, "i", i.toString());
  
          var carousImgHtml = carouselImgSnippetHtml;
          carousImgHtml = $maherenterprise.insertProperty(carousImgHtml, "itemNo", itemNo);
          carousImgHtml = $maherenterprise.insertProperty(carousImgHtml, "pictureNo", pictureNo.toString());
  
          if (i == 0) {
            indicatorHtml = $maherenterprise.insertProperty(indicatorHtml, "classIsActive", ' class="active"');
            carousImgHtml = $maherenterprise.insertProperty(carousImgHtml, "activeTxt", " active");
          } else {
            indicatorHtml = $maherenterprise.insertProperty(indicatorHtml, "classIsActive", "");
            carousImgHtml = $maherenterprise.insertProperty(carousImgHtml, "activeTxt", "");
          }
          
          allCarouselIndicatorHtml += indicatorHtml;
          allCarouselImgHtml += carousImgHtml;
        }
        
        // Finally add all missing data to equipment page html
        equipmentSnippetHtml = $maherenterprise.insertProperty(equipmentSnippetHtml, "carouselIndicators", allCarouselIndicatorHtml);
        equipmentSnippetHtml = $maherenterprise.insertProperty(equipmentSnippetHtml, "carouselImg", allCarouselImgHtml);
        equipmentSnippetHtml = $maherenterprise.insertProperty(equipmentSnippetHtml, "name", name);
        equipmentSnippetHtml = $maherenterprise.insertProperty(equipmentSnippetHtml, "price", price);
        equipmentSnippetHtml = $maherenterprise.insertProperty(equipmentSnippetHtml, "make", make);
        equipmentSnippetHtml = $maherenterprise.insertProperty(equipmentSnippetHtml, "serialNo", serialNumber);
        equipmentSnippetHtml = $maherenterprise.insertProperty(equipmentSnippetHtml, "model", model);
        equipmentSnippetHtml = $maherenterprise.insertProperty(equipmentSnippetHtml, "year", year);
        equipmentSnippetHtml = $maherenterprise.insertProperty(equipmentSnippetHtml, "condition", condition);
        equipmentSnippetHtml = $maherenterprise.insertProperty(equipmentSnippetHtml, "category", category);
        equipmentSnippetHtml = $maherenterprise.insertProperty(equipmentSnippetHtml, "stock", stock);
        equipmentSnippetHtml = $maherenterprise.insertProperty(equipmentSnippetHtml, "vin", vin);
  
        return equipmentSnippetHtml;
      }
  
  
  
  
  })(window);
  
  
    