const express = require('express');
const router = express.Router();
const {database} =require('../config/helpers');

/* GET All products. */

router.get('/', function(req, res) {
  let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; //current page
  const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10; //limit of items per page
let startValue;
let endValue;
if(page > 0){
  startValue = (page * limit) - limit; //0, 10, 20 30
  endValue = page * limit;
}else {
  startValue  = 0;
  endValue = 10;
}
database.table('products as p')
    .join([{
      table:'categories as c',
        on: 'c.id = p.cat_id'
    }])
    .withFields(['c.title as category',
        'p.title as name',
        'p.price' ,
        'p.description',
        'p.quantity',
        'p.image',
        'p.id'])
    .slice(startValue,endValue)
    .sort({id: .1})
    .getAll()
    .then(prods => {
        if(prods.length > 0){
            res.status(200).json({
                count: prods.length,
                products: prods
            });
        }else {
            res.json({message: 'لايوجد منتجات هنا'});
        }
    }).catch(err => console.log(err));
});


//get single product
router.get('/:prodId', (req, res)=>{
    let productId = req.params.prodId;


    database.table('products as p')
        .join([{
            table:'categories as c',
            on: 'c.id = p.cat_id'
        }])
        .withFields(['c.title as category',
            'p.title as name','p.price', 'p.description', 'p.quantity', 'p.image','p.author', 'p.id'])
        .filter({'p.id' : productId})
        .get()
        .then(prod => {
            if(prod){
                res.status(200).json(prod);
            }else {
                res.json({message:(` لايوجد منتج يحمل الرقم  ${productId}`)});
            }
        }).catch(err => console.log(err));

});

//get all product from one particular category

router.get('category/:catname', (req, res) =>{
    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; //current page
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10; //limit of items per page
    let startValue;
    let endValue;
    if(page>0){
        startValue = (page * limit) - limit; //0, 10, 20 30
        endValue = page * limit;
    }else {
        startValue  = 0;
        endValue = 10;
    }
    //fetch the category name from the url

    const cat_title = req.params.catName;
    database.table('products as p')
        .join([{
            table:'categories as c',
            on: `c.id = p.cat_id WHERE c.title LIKE '%${cat_title}%'`
        }])
        .withFields(['c.title as category',
            'p.title as name','p.price' , 'p.quantity', 'p.image', 'p.id'])
        .slice(startValue,endValue)
        .sort({id: .1})
        .getAll()
        .then(prods => {
            if(prods.length > 0){
                res.status(200).json({
                    count: prods.length,
                    products: prods
                });
            }else {
                res.json({message: `${cat_title}لايوجد منتجات في `});
            }
        }).catch(err => console.log(err));
});
module.exports = router;
