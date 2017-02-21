// gets an array of products and returns an array of IDs of the products
export function getProductsID(products){
  let productsID = []
  products.forEach(function (product){
    productsID.push(product.id)
  });
  return productsID
}


// replaces the products from event by the products with matching ids in all_products
// this can be useful when trying to only have one type of product and not the product type that comes from EVENT and
// one which comes from the full products list from the server
export function convertEventProdToFullProducts(event, all_products){
  event.products.forEach(function (product, index, product_array){
    for (let i = 0; i < all_products.length; i++){
      if (all_products[i].id == product.id){
        product_array[index] = all_products[i]
      }
    }
  })
}
