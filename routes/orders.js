var express = require('express');
var router = express.Router();
var {database} = require('../config/helpers');



/* GET ALL ORDERS . */
router.get('/',(req, res)=>{
  database.table('orders_details as od')
      .join([
          {
            table: 'orders as o',
            on: 'o.id = od.order_id'
          },
          {
            table: 'products as p',
            on: 'p.id = od.product_id'
          },
          {
            table: 'users as u',
            on:'u.id = o.user_id'
          }])
      .withFields(['o.id','p.title as name','p.description', 'p.price', 'u.username'])
      .sort({id: 1})
      .getAll()
      .then(orders =>{
        if(orders.length >0){
          res.status(200).json(orders);
        }else {
          res.json({message:'لم يتم إيجاد طلبات هنا'});
        }
      }).catch(err => console.log(err));
});

//get single product
router.get('/:id',(req, res)=>{
  const orderId = req.params.id;
  database.table('orders_details as od')
      .join([
          {
            table: 'orders as o',
            on: 'o.id = od.order_id'
          },
          {
            table: 'products as p',
            on: 'p.id = od.product_id'
          },
          {
            table: 'users as u',
            on:'u.id = o.user_id'
          }
      ])
      .withFields(['o.id','p.title as name','p.description', 'p.price', 'u.username'])
      .filter({'o.id': orderId})
      .getAll()
      .then(orders =>{
        if(orders.length >0){
          res.status(200).json(orders);
        }else {
          res.json({message:`لايوجد طلب يحمل الرقم ${oederId}`});
        }
      }).catch(err => console.log(err));
});

//place a new order
router.post('/new', (req, res)=>{
  let {userId, products} = req.body;

  if(userId !== null && userId > 0 && !isNaN(userId)){
    database.table('orders')
        .insert({
          user_id: userId
        }).then(newOrderId => {
      if(newOrderId > 0){
        products.forEach(async (p) => {
          let data = await  database.table('products').filter({id: p.id}) .withFields(['quantity']).get();

          let inCart = p.incart;

          //deduct the number of pieces orderd from the quantity in DB
          if(data.quantity > 0){
            data.quantity = data.quantity - inCart;

            if(data.quantity < 0){data.quantity = 0;}

          }else{
            data.quantity = 0;

          }

          //insert order detail  to the new genrated order id
          database.table('orders_details')
              .insert({
                order_id: newOrderId,
                product_id: p.id,
                quantity: inCart
              }).then(newId =>{
                database.table('products')
                    .filter({id: p.id})
                    .update({
                      quantity: data.quantity
                    }).then(successNum =>{}).catch(err => console.log(err));


          }).catch(err => console.log(err));

        });

      } else {
        res.json({message:'فشل ارسال الطلب الجديد', success: false})
      }
      res.json({
        message: ` الطلبية تمت اضافتها بنجاح تحت رقم ${newOrderId}`,
        success:true,
        order_id: newOrderId,
        products: products
      });
    }).catch(err => console.log(err));

  } else {
    res.json({message:  'فشلت الطلبية الجديدة', success: false})
  }




});

//fake payment getway call

router.post('/payment', (req, res)=>{
  setTimeout(()=> {
    res.status(200).json({success:true});
  }, 3000);
})
module.exports = router;
