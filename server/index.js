const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var session = require('express-session');
var fs = require('fs');
const fileUpload = require('express-fileupload');
var path = require('path');
var unique = require('array-unique');
const app = express();
const util = require('util');
var cookieParser = require('cookie-parser');
app.use(fileUpload());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// const upload = multer({dest: 'upload/'});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var isNullOrEmpty = require('is-null-or-empty');

// app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ key: 'username', secret: 'ambalabanijjopluscom' }));

const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecommerce',
  dateStrings:true
});

dbConnection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

const query = util.promisify(dbConnection.query).bind(dbConnection);

app.post('/api/saveVendor', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  
  const file = req.files.file;
  
  file.mv(`${__dirname}/../public/upload/vendor/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    try {
      var insert_sql_query = "INSERT INTO vendor (name, email, website, address, status,image) VALUES ('" + req.body.name + "', '" + req.body.email + "', '" + req.body.website + "', '" + req.body.address + "', '1','" + file.name + "' )";
      
      dbConnection.query(insert_sql_query, function (err, result) {
        
        if (result) {
          console.log("1 record inserted to category");
          return res.send({ success: true, message: "success" });
        }
        else {
          console.log('Error to inseret at category : ', err);
          return res.send({ success: false, error: err });
        }
        
      });
      
    }
    catch (error) {
      if (error) return res.send({ success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', message: req.body });
    }
  });
  
  
  // imageFile.mv(`${__dirname}/public/${req.body.filename}.jpg`, function(err) {
  //   if (err) {
  //     return res.status(500).send(err);
  //   }
  //   return res.send({success: true, request:req.body});
  //   // res.json({file: `public/${req.body.filename}.jpg`});
  // });
  
  
});



app.get('/api/category_order_list_delete', async function(req, res, next) {
  const category_order_delete = await query('DELETE FROM category_order');
  return res.send({ success: true, message: 'data' });
});
app.get('/api/search_filter_categories', (req, res) => {
  console.log('categoryList Values : ', req.query.categoryList);
  
  dbConnection.query('SELECT * FROM category WHERE parent_category_id = 0', function (error, results, fields) {
    
    if (error) throw error;
    return res.send({ data: results, message: 'data' });
    
  });
  
  // return res.send({ success: 'true', data: req.query.id, message: 'data' });
  
});
app.get('/api/search_category_for_order_list', (req, res) => {
  console.log('Searched Text : ', req.query.search_string);
  dbConnection.query('SELECT * FROM category WHERE parent_category_id = 0 AND category_name LIKE "%'+ req.query.search_string +'%"', function (error, results, fields) {
    if (error) throw error;
    return res.send({ data: results, message: 'data' });
  });
  // return res.send({ success: 'true', data: req.query.id, message: 'data' });
});
app.get('/api/category_order_list', async function(req, res, next) {
  const category_order_select = await query('SELECT * FROM category_order where status = 1');
  return res.send({ success: true, data: category_order_select, message: 'data' });
});

app.post('/api/save_selected_category_order', async function(req, res, next) {
  console.log('selected category submitted value : ', req.body);
  const category_order_select = await query('SELECT COUNT(id) AS total_category_order_size FROM category_order where status = 1');
  if (category_order_select[0].total_category_order_size > 0) {
    const category_order_delete = await query('DELETE FROM category_order');
  }
  else {
    console.log('Not Working ! ', category_order_select[0].total_category_order_size);
  }
  for ( const i in req.body ) {
    console.log(req.body[i].categoryName);
    
    const category_order_insert = await query("INSERT INTO category_order (category_id, category_name, status) VALUES ('"+req.body[i].categoryId+"', '"+req.body[i].categoryName+"', '1')");
  }
  return res.send({ success: true, message: 'data' });
});



app.get('/api/category_feature_list', async function(req, res, next) {
  const category_order_select = await query('SELECT * FROM featured_category where status = 1');
  return res.send({ success: true, data: category_order_select, message: 'data' });
});
app.get('/api/category_feature_list_delete', async function(req, res, next) {
  const category_order_delete = await query('DELETE FROM featured_category');
  return res.send({ success: true, message: 'data' });
});
app.post('/api/save_feature_category', async function(req, res, next) {
  console.log('selected category submitted value : ', req.body);
  const category_order_select = await query('SELECT COUNT(id) AS total_category_order_size FROM featured_category where status = 1');
  if (category_order_select[0].total_category_order_size > 0) {
    const category_order_delete = await query('DELETE FROM featured_category');
  }
  else {
    console.log('Not Working ! ', category_order_select[0].total_category_order_size);
  }
  for ( const i in req.body ) {
    console.log(req.body[i].categoryName);
    
    const category_order_insert = await query("INSERT INTO featured_category (category_id, category_name, status) VALUES ('"+req.body[i].categoryId+"', '"+req.body[i].categoryName+"', '1')");
  }
  return res.send({ success: true, message: 'data' });
});







app.post('/api/checkUsername', (req, res) => {
  try{
    var query = "Select COUNT(*) as countUsername from user where username='"+ req.body.inputValue+"'";
    dbConnection.query(query, function (err, result) {
      if (result[0].countUsername!=0) {
        return res.send({ success: true, message: false });
      }
      else {
        console.log('Error to inseret at category : ', err);
        return res.send({ success: true, message: true });
      }
    });
  }
  catch (error) {
    if (error) return res.send({ success: false, error: 'Error has occured', request: req.body });
  }
});


app.post('/api/checkShopExist', (req, res) => {
  try{
    var query = "Select COUNT(*) as countShop from vendor_details where shop_name='"+ req.body.inputValue+"'";
    dbConnection.query(query, function (err, result) {
      if (result[0].countShop!=0) {
        return res.send({ success: true, message: false });
      }
      else {
        console.log('Error  : ', err);
        return res.send({ success: true, message: true });
      }
    });
  }
  catch (error) {
    if (error) return res.send({ success: false, error: 'Error has occured', request: req.body });
  }
});

app.get('/api/categories', (req, res) => {
  dbConnection.query('SELECT * FROM category ORDER BY id DESC', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'category list.' });
  });
});

app.get('/api/product_specification_names', (req, res) => {
  dbConnection.query('SELECT * FROM product_specification_names ORDER BY id DESC', function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'sepecification name list.' });
  });
});

// app.get('/api/product_specification_details', (req, res) => {
//   dbConnection.query('SELECT * FROM product_specification_details WHERE status="active" ORDER BY id DESC', function (error, results, fields) {
//     console.log(results);
//     if (error) throw error;
//     return res.send({ error: error, data: results, message: 'sepecification name list.' });
//   });
// });

app.get('/api/vendor_list_for_product', (req, res) => {
  dbConnection.query('SELECT * FROM vendor ORDER BY id DESC', function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'sepecification name list.' });
  });
});

app.get('/api/search_products', (req, res) => {
  console.log('Vendor Values : ', req.query.vendorId);
  console.log('Vendor Values : ', req.query.id);
  
  dbConnection.query('SELECT * FROM products WHERE vendor_id = "'+ req.query.vendorId +'" AND product_name LIKE "%'+ req.query.id +'%" OR product_sku LIKE "%'+ req.query.id +'%" ', function (error, results, fields) {
    
    if (error) throw error;
    return res.send({ data: results, message: 'data' });
    
  });
  
  // return res.send({ success: 'true', data: req.query.id, message: 'data' });
  
});

app.get('/api/bill_no', (req, res) => {
  
  dbConnection.query('SELECT COUNT(id) AS count_id FROM inv_purchase WHERE supplierId = "'+ req.query.vendorId +'" AND status = "1" ', function (error, results, fields) {
    
    if (error) throw error;
    return res.send({ success: true, data: results, message: 'data' });
    
  });
  
  // return res.send({ success: 'true', data: req.query.id, message: 'data' });
  
});

// app.get('/api/product_list', (req, res) => {
//   console.log('Session Values : ', req.query.id);
  
//   dbConnection.query('SELECT employee_id, user_type FROM user WHERE username="'+ req.query.id +'"', function (error, results, fields) {
//     console.log('User Type : ', results[0].user_type);
//     if (error) throw error;
//     if (results[0].user_type == 'vendor') {
//       vendor_products (results[0].employee_id, res);
//     }
//     else {
//       admin_products (res);
//     }
    
//   });
  
// });

// function vendor_products (vendor_id, res) {
//   console.log('Inside the vendor_products function & vendor is : ', vendor_id);
//   dbConnection.query('SELECT * FROM products WHERE vendor_id = "'+ vendor_id +'" ORDER BY id DESC', function (error, results, fields) {
//     console.log(results);
//     if (error) throw error;
//     return res.send({ error: error, data: results, message: 'sepecification name list.' });
//   });
// }

// function admin_products (res) {
//   dbConnection.query('SELECT * FROM products ORDER BY id DESC', function (error, results, fields) {
//     console.log(results);
//     if (error) throw error;
//     // return results;
//     return res.send({ error: error, data: results, message: 'sepecification name list.' });
//   });
// }

// app.get('/api/product_list_vendor_wise', (req, res) => {
//   console.log('Vendor Id : ', req.body);
//   dbConnection.query('SELECT * FROM products ORDER BY id DESC', function (error, results, fields) {
//     console.log(results);
//     if (error) throw error;
//     return res.send({ error: error, data: results, message: 'sepecification name list.' });
//   });
// });

app.get('/api/updateShop', (req, res) => {
  // dbConnection.query("UPDATE user SET user_status='approved'", function (error, results) {
  //   console.log(results);1
  //   if (error) throw error;
  
  
  //   return res.send({ error: error, data: results, message: 'success' });
  // });
  
  return res.send({ error: error, data: 'results', message: 'success' });
});

app.get('/api/user_list', (req, res) => {
  dbConnection.query('SELECT * FROM user', function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'sepecification name list.' });
  });
});

app.post('/api/saveVendor', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  else{
    
    try {
      const file = req.files.file;
      file.mv(`${__dirname}/../public/upload/vendor/personal/${file.name}`, err => {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }
      });
      var insert_sql_query = "INSERT INTO vendor (name, email, website, address,image, status) VALUES ('" + req.body.name + "', '" + req.body.email + "', '" + req.body.website + "', '" + req.body.address + "','" + file.name + "', '1' )";
      dbConnection.query(insert_sql_query, function (err, result) {
        
        if (result) {
          res.status(200).json({ message: 'success' });
        }
        else {
          console.log('Error to inseret at category : ', err);
          return res.send({ success: false, error: err });
        }
      });
      
      // let sampleFile = [];
      // sampleFile = req.files.file;
      // sampleFile.map(function(file,index){
      //       file.mv(`${__dirname}/../public/upload/vendor/${file.name}`, err => {
      //         if (err) {
      //           console.error(err);
      //           return res.status(500).send(err);
      //         }
      //       });
      //       console.log(file.fileName);
      //     })
      
      
    }
    catch (error) {
      if (error) return res.send({ success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request: req.body });
    }
  }
});

// app.get('/api/allProducts', (req, res) => {
//   dbConnection.query('SELECT * FROM products ORDER BY id DESC', function (error, results, fields) {
//     console.log(results);
//     if (error) throw error;
//     return res.send({ error: error, data: results, message: 'product list.' });
//   });
// });

app.get('/api/specialCategoryListForSpecification', async function(req, res, next) {
  const parentAndChild = [];
  const parentAndChildRelation = [];
  let relationIndex = 0;
  const category_name = await query('SELECT * FROM category');
  for ( const i in category_name ) {
    if (category_name[i].parent_category_id == 0) {
      parentAndChild[category_name[i].id] = category_name[i].category_name;
    }
    
    for ( const j in parentAndChild ) {
      if (category_name[i].parent_category_id == j) {
        parentAndChild[category_name[i].id] = parentAndChild[j]+'->'+category_name[i].category_name;
        ++relationIndex;
        parentAndChildRelation[relationIndex] = category_name[i].parent_category_id;
      }
    }
  }
  
  for ( const i in unique(parentAndChildRelation) ) {
    delete parentAndChild[parentAndChildRelation[i]];
  }
  
  for ( const i in parentAndChild ) {
    console.log('Consoling Chid Category : ','index : '+i+' value : '+parentAndChild[i]);
  }
  
  return res.send({ data: parentAndChild, message: 'category list.' });
  
});

app.post('/api/saveProduct', (req, res) => {
  try {
    if(req.files!=null){
      if(!req.body.productFiles){
        var productFilesArray = [];
        productFilesArray = req.files.productFiles;
        if(Array.isArray(productFilesArray)){
          productFilesArray.map(function(file,index){
            file.mv(`${__dirname}/../public/upload/product/productImages/${file.name}`, err => {
              if (err) {
                console.error(err);
                return res.status(500).send(err);
              }
            });
          })
        }
        else{
          let productFiles = req.files.productFiles;
          productFiles.mv(`${__dirname}/../public/upload/product/productImages/${productFiles.name}`, err => {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
          });
        }
      }

      if(!req.body.productDescriptionFiles){
        if(req.files.productDescriptionFiles){

          if(Array.isArray(req.files.productDescriptionFiles)){
            req.files.productDescriptionFiles.map(function(file,index){
              file.mv(`${__dirname}/../public/upload/product/productDescriptionImages/${file.name}`, err => {
                if (err) {
                  console.error(err);
                  return res.status(500).send(err);
                }
              });
            })
          }
          else{
            let productDescriptionFiles = req.files.productDescriptionFiles;
            productDescriptionFiles.mv(`${__dirname}/../public/upload/product/productDescriptionImages/${productDescriptionFiles.name}`, err => {
              if (err) {
                console.error(err);
                return res.status(500).send(err);
              }
            });
          }
        }
      }
    }
    
    var specificationValues = '';
    var specificationKey = '';
    var specificationArray = [];
    var specificationNameArray = [];
    var productDescriptionFullState = {};
    var fullStateData = JSON.parse(req.body.specificationDetailsFullState);

    var loopCounter = Object.values(fullStateData).length + 1;
    for (var i = 0; i < loopCounter; i++) {
      if (i < Object.values(fullStateData).length) {
        let testObject = {};
        specificationValues = Object.values(Object.values(fullStateData)[i]);
        
        specificationKey = Object.keys(fullStateData)[i];
        testObject.specificationDetailsName = specificationKey;
        testObject.specificationDetailsValue = specificationValues[0];
        specificationArray.push(testObject);
      }
      else if (i == Object.values(fullStateData).length) {
        
      }
    }
    
    var specificationBoxFun = JSON.parse(req.body.productSpecificationBoxFun);
    var counter = 0;
    for (var i = 0; i < specificationBoxFun.length; i++) {
      let testObject = {};
      ++counter;
      var spliting = specificationBoxFun[i].split(':');
      testObject.categoryId = spliting[0];
      testObject.specificationNameId = spliting[1];
      testObject.specificationNameValue = spliting[2];
      specificationNameArray.push(testObject);
      if (counter == specificationBoxFun.length) {
        // console.log("Specificationdf Names",specificationNameArray);return false;
        
      }
    }
    
    
    var insert_sql_query = "INSERT INTO products (product_name, category_id, product_sku, productPrice, product_specification_name, product_specification_details_description, product_full_description, qc_status, image,home_image, vendor_id, status) VALUES ('"+req.body.productName+"', '"+req.body.categoryIdValue+"', '"+req.body.productSKUcode+"', '"+req.body.productPrice+"', '"+JSON.stringify(specificationNameArray)+"','"+JSON.stringify(specificationArray)+"' , '"+req.body.productDescriptionFull+"', '1', '"+req.body.productImagesJson+"','"+req.body.homeImage+"', '"+req.body.vendor_id+"', '1' )";
    dbConnection.query(insert_sql_query, function (err, result) {
      if (result) {
        console.log("1 record inserted to category");     
        return res.send({success: true, server_message: result, message: 'success'});
      }
      else {
        console.log('Error to inseret at category : ', err);
        return res.send({success: false, error: err, message: 'DB Error'});
      }
    });
  }
  
  catch (error) {
    console.log("Consolingggg",error);
    
    if (error) return res.send({ success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request: req.body });
  }
  //   }
});

app.post('/api/saveProductLL', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  else{
    
    try {
      //  var productFile = [];
      //  var producDescriptiontFile = [];
      // productFile = req.files.productFiles;
      // producDescriptiontFile = req.files.productDescriptionFiles;
      // console.log('Consoling pp files',productFile);return false;
      
      
      if(req.files.productFiles){
        if(Array.isArray(req.files.productFiles)){
          req.files.productFiles.map(function(file,index){
            file.mv(`${__dirname}/../public/upload/product/productImages/${file.name}`, err => {
              if (err) {
                console.error(err);
                return res.status(500).send(err);
              }
            });
          })
        }
        else{
          
          let productFiles = req.files.productFiles;
          productFiles.mv(`${__dirname}/../public/upload/product/productImages/${productFiles.name}`, err => {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
          });
        }
      }
      console.log('consoling product files is array',Array.isArray(req.files.productFiles));
      
      if(req.files.productDescriptionFiles){
        if(Array.isArray(req.files.productDescriptionFiles)){
          req.files.productDescriptionFiles.map(function(file,index){
            file.mv(`${__dirname}/../public/upload/product/productDescriptionImages/${file.name}`, err => {
              if (err) {
                console.error(err);
                return res.status(500).send(err);
              }
            });
          })
        }
        else{
          let fileDescription = req.files.producDescriptiontFile;
          fileDescription.mv(`${__dirname}/../public/upload/product/productDescriptionImages/${fileDescription.name}`, err => {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
          });
        }
      }
      console.log('insert_sql_query');
      
      var insert_sql_query = "INSERT INTO products (product_name, category_id, product_sku, product_specification_name, product_specification_details_description, product_full_description, qc_status, image,home_image, vendor_id, status) VALUES ('"+req.body.productName+"', '"+req.body.categoryIdValue+"', '"+req.body.productSKUcode+"', '"+JSON.stringify(req.body.productSpecificationBoxFun)+"', 'oo', '"+JSON.stringify(req.body.productDescriptionFull)+"', '1', '"+JSON.stringify(req.body.productImagesJson)+"','"+req.body.homeImage+"', '"+req.body.vendor_id+"', '1' )";
      dbConnection.query(insert_sql_query, function (err, result) {
        
        if (result) {
          console.log("1 record inserted to category");     
          return res.send({success: true, server_message: result, message: 'success'});
        }
        else {
          console.log('Error to inseret at category : ', err);
          return res.send({success: false, error: err, message: 'DB Error'});
        }
      });
    }
    catch (error) {
      if (error) return res.send({ success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request: req.body });
    }
  }
});

app.post('/api/saveProductpp',(req,res)=>{
  console.log('The Request : ', req.files.productFiles);
  console.log('Specification Name : ', req.body.productSpecificationBoxFun);
  console.log('specification details : ', Object.values(req.body.specificationDetailsFullState));
  var specificationValues = '';
  var specificationKey = '';
  var specificationArray = [];
  var loopCounter = Object.values(req.body.specificationDetailsFullState).length + 1;
  console.log(JSON.stringify(specificationArray));
  new Promise (function (resolve, reject) {
    for (var i = 0; i < loopCounter; i++) {
      if (i < Object.values(req.body.specificationDetailsFullState).length) {
        let testObject = {};
        specificationValues = Object.values(Object.values(req.body.specificationDetailsFullState)[i]);
        
        specificationKey = Object.keys(req.body.specificationDetailsFullState)[i];
        testObject.specificationDetailsName = specificationKey;
        testObject.specificationDetailsValue = specificationValues[0];
        specificationArray.push(testObject);
        
        // specificationArray[i] = specificationKey+' : '+specificationValues[0];
        
        console.log('The values are consoling : ', specificationArray);
        console.log('The values are : ', specificationKey);
      }
      else if (i == Object.values(req.body.specificationDetailsFullState).length) {
        resolve(specificationArray);
      }
      else {
        reject('rejected');
      }
    }
  }).then( function (resolve) {
    console.log('Testing', JSON.stringify(resolve));
    // resolve(resolve);
    //return JSON.stringify(resolve);
    return resolve;
  }).then( function (resolve) {
    try {
      if ((isNullOrEmpty(req.body.productName) == false) && (isNullOrEmpty(req.body.productPrice) == false) && (isNullOrEmpty(req.body.productSKUcode) == false) && (req.body.productCategory != 0) && (isNullOrEmpty(req.body.productBrand) == false) && (req.body.vendorId != 0)) {
        
        var insert_sql_query = "INSERT INTO products (product_name, category_id, product_sku, product_specification_name, product_specification_details_description, product_full_description, qc_status, image, vendor_id, status) VALUES ('"+req.body.productName+"', '"+req.body.productCategory+"', '"+req.body.productSKUcode+"', '"+JSON.stringify(req.body.productSpecificationBoxFun)+"', '"+JSON.stringify(resolve)+"', '"+JSON.stringify(req.body.productDescriptionFull)+"', '1', '"+JSON.stringify(req.body.images)+"', '"+req.body.vendorId+"', '1' )";
        
        dbConnection.query(insert_sql_query, function (err, result) {
          
          if (result) {
            console.log("1 record inserted to category");
            return res.send({success: true, server_message: result, message: 'DB Success'});
          }
          else {
            console.log('Error to inseret at category : ', err);
            return res.send({success: false, error: err, message: 'DB Error'});
          }
          
        });
      }
      else{
        return res.send({success: false, message: 'required field'});
      }
      
    }
    catch (error) {
      if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body, message: 'Exception'});
    }
    // return res.send({success: true, message: 'Check Promise'});
  }).catch(function (reject) {
    console.log(reject);
    return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body, message: 'Promise Exception !!'});
  })
  // console.log(JSON.stringify(specificationName));
  // for (var i = 0; i < req.body.specificationDetailsFullState.length; i++) {
  //   // var splited = req.body.specificationDetailsFullState[i].split(':');
  //   // specificationDetails[i] = splited;
  //   console.log(req.body.specificationDetailsFullState[i]); 
  // }
  // console.log('')
  // console.log(JSON.stringify( req.body.specificationDetailsFullState));
  // return res.send({success: true, message: 'Check Promise'});
  
});

// app.post('/api/saveProduct',(req,res)=>{
//   // console.log('The Request : ', req.body);

//   console.log('Specification Name : ', req.body.productSpecificationBoxFun);
//   console.log('specification details : ', Object.values(req.body.specificationDetailsFullState));

//   var specificationValues = '';
//   var specificationKey = '';
//   var specificationArray = [];
//   var specificationNameArray = [];
//   var loopCounter = Object.values(req.body.specificationDetailsFullState).length + 1;

//   console.log(JSON.stringify(specificationArray));

//   new Promise (function (resolve, reject) {

//     for (var i = 0; i < loopCounter; i++) {

//       if (i < Object.values(req.body.specificationDetailsFullState).length) {
//         let testObject = {};
//         specificationValues = Object.values(Object.values(req.body.specificationDetailsFullState)[i]);

//         specificationKey = Object.keys(req.body.specificationDetailsFullState)[i];
//         testObject.specificationDetailsName = specificationKey;
//         testObject.specificationDetailsValue = specificationValues[0];
//         specificationArray.push(testObject);

//         // specificationArray[i] = specificationKey+' : '+specificationValues[0];

//         console.log('The values are consoling : ', specificationArray);
//         console.log('The values are : ', specificationKey);
//       }
//       else if (i == Object.values(req.body.specificationDetailsFullState).length) {
//         resolve(specificationArray);
//       }
//       else {
//         reject('rejected');
//       }

//     }

//   }).then( function (resolve) {
//     var counter = 0;
//     for (var i = 0; i < req.body.productSpecificationBoxFun.length; i++) {
//       let testObject = {};
//       console.log ('fun box : ', req.body.productSpecificationBoxFun[i]);
//       ++counter;

//       var spliting = req.body.productSpecificationBoxFun[i].split(':');

//       console.log(spliting);

//       testObject.categoryId = spliting[0];
//       testObject.specificationNameId = spliting[1];
//       testObject.specificationNameValue = spliting[2];

//       specificationNameArray.push(testObject);

//       if (counter == req.body.productSpecificationBoxFun.length) {
//         return resolve;
//       }
//     }

//   }).then( function (resolve) {
//     console.log('Resolve and Values : ', specificationArray);

//     console.log('Product Name : ', req.body.productName);
//     console.log('Product Price : ', req.body.productPrice);
//     console.log('Product SKU : ', req.body.productSKUcode);
//     console.log('Product Category : ', req.body.productCategory);
//     console.log('Product Brand : ', req.body.productBrand);
//     console.log('Product Vendor : ', req.body.vendorId);

//     try {
//       if ((isNullOrEmpty(req.body.productName) == false) && (isNullOrEmpty(req.body.productPrice) == false) && (isNullOrEmpty(req.body.productSKUcode) == false) && (req.body.productCategory != 0) && (isNullOrEmpty(req.body.productBrand) == false) && (req.body.vendorId != 0)) {

//         var insert_sql_query = "INSERT INTO products (product_name, category_id, product_sku, product_specification_name, product_specification_details_description, product_full_description, qc_status, image, vendor_id, status) VALUES ('"+req.body.productName+"', '"+req.body.productCategory+"', '"+req.body.productSKUcode+"', '"+JSON.stringify(specificationNameArray)+"', '"+JSON.stringify(specificationArray)+"', '"+JSON.stringify(req.body.productDescriptionFull)+"', '1', '"+JSON.stringify(req.body.images)+"', '"+req.body.vendorId+"', '1' )";

//         dbConnection.query(insert_sql_query, function (err, result) {

//             if (result) {
//                 console.log("1 record inserted to category");
//                 return res.send({success: true, server_message: result, message: 'DB Success'});
//             }
//             else {
//                 console.log('Error to inseret at category : ', err);
//                 return res.send({success: false, error: err, message: 'DB Error'});
//             }

//         });
//       }
//       else{
//         return res.send({success: false, message: 'required field'});
//       }

//     }
//     catch (error) {
//         if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body, message: 'Exception'});
//     }

//     // return res.send({success: true, message: 'Check Promise'});

//   }).catch(function (reject) {
//     console.log(reject);
//     return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body, message: 'Promise Exception !!'});
//   })

//   // console.log(JSON.stringify(specificationName));

//   // for (var i = 0; i < req.body.specificationDetailsFullState.length; i++) {
//   //   // var splited = req.body.specificationDetailsFullState[i].split(':');
//   //   // specificationDetails[i] = splited;
//   //   console.log(req.body.specificationDetailsFullState[i]); 
//   // }
//   // console.log('')
//   // console.log(JSON.stringify( req.body.specificationDetailsFullState));

//   // return res.send({success: true, message: 'Check Promise'});



// });

app.post('/api/vendor-registration',(req,res)=>{
  console.log('The Request : ', req.body);
  
  var checkVendorEntry = 0
  
  if (req.body.userPassword == req.body.userRePassword) {
    
    try {
      if ((isNullOrEmpty(req.body.userName) == false) && (isNullOrEmpty(req.body.userPassword) == false) && (isNullOrEmpty(req.body.userEmail) == false) ) {
        
        var insert_sql_query = "INSERT INTO vendor (name, email, status) VALUES ('"+req.body.name+"', '"+req.body.userEmail+"', 'active')";
        
        dbConnection.query(insert_sql_query, function (err, result) {
          
          if (result) {
            console.log("1 record inserted to vendor");
            selectVendorInfo (req.body.userEmail, req.body.userName, req.body.userPassword);
          }
          else {
            console.log('Error to inseret at vendor : ', err);
            return res.send({success: false, error: err});
          }
        });
      }
      else{
        return res.send({success: false});
      }
    }
    catch (error) {
      if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
    }
    
    function selectVendorInfo (email, userName, userPassword) {
      console.log('email : ', email);
      select_sql_query = "SELECT id FROM vendor WHERE email='"+email+"'";
      dbConnection.query(select_sql_query, function (error, results, fields) {
        console.log('Results From Vendor', results);
        insertUserInfo (userName, userPassword, results[0].id);
        if (error) throw error;
        // return res.send({ error: error, data: results, message: 'sepecification name list.' });
      });
      // return 
    }
    
    function insertUserInfo (userName, userPassword, employee_id) {
      try {
        var insert_sql_query = "INSERT INTO user (username, password, employee_id, user_type) VALUES ('"+userName+"', '"+userPassword+"', '"+employee_id+"', 'vendor')";
        
        dbConnection.query(insert_sql_query, function (err, result) {
          console.log('user insert result : ', result);
          console.log('user error result : ', err);
          if (result) {
            console.log("1 record inserted to user");
            return res.send({success: true, server_message: result});
          }
          else {
            console.log('Error to inseret at user : ', err);
            return res.send({success: false, error: err});
          }
        });
      }
      catch (error) {
        if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
      }
    }
    
    
  }
  else {
    Console.log('Not OK !!');
    return res.send({success: false});
  }
  
  
});

app.post('/api/saveProductPurchase', (req, res) => {
  console.log('Product Purchase : ', req.body);
  
  var purchase_table_id = 0;
  var purchaseListArray = [];
  
  promise = new Promise (function (resolve, reject) {
    
    try {
      var insert_sql_query = "INSERT INTO inv_purchase (billNo, chalanNo, supplierId, purchaseDate, totalQuantity, totalAmount, status) VALUES ('"+req.body.currentBillNo+"', '"+req.body.chalanNo+"', '"+req.body.vendorId+"', '"+req.body.currentDate+"', '"+req.body.grandTotalQuantity+"', '"+req.body.grandTotalPrice+"', '1')";
      
      dbConnection.query(insert_sql_query, function (err, result) {
        console.log('user insert result : ', result.insertId);
        console.log('user error result : ', err);
        if (result) {
          console.log("1 record inserted to user");
          // return res.send({success: true, server_message: result});
          resolve(result.insertId);
        }
        else {
          console.log('Error to inseret at user : ', err);
          return res.send({success: false, error: err});
        }
      });
    }
    catch (error) {
      if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
    }
    
  })/*.then( function (resolve) {
    
    select_sql_query = "SELECT id FROM inv_purchase WHERE billNo='"+req.body.currentBillNo+"'";
    
    console.log('QUERY : ', select_sql_query);
    
    console.log(resolve);
    
    // dbConnection.query(select_sql_query, function (error, results) {
    //   console.log("results",results);
    //   if (results.length > 0) {
    //     purchase_table_id = results[0].id;
    //     return purchase_table_id;
    //   }
    //   else {
    //     var success = false;
    //     return res.send({success: false, error: err});
    //   }
    // });
    
    dbConnection.query(select_sql_query, function (error, results) {
      console.log("results",results);
      console.log("results",results.length);
      if (results.length > 0) {
        var success = true;
        console.log('Purchase ID : ', results[0].id);
        purchase_table_id = results[0].id;
        return results[0].id;
      }
      else {
        var success = false;
      }
      if (error) throw error;
      
    });
    
  })*/.then( function (resolve) {
    console.log('returned value form previous state : ', resolve);
    console.log('purchase_table_id form previous state : ', purchase_table_id);
    purchaseElements = req.body.PurchaseList;
    console.log('ASYNC LOOP OUTSIDE');
    async.forEachOf(purchaseElements, function (purchaseElement, i, inner_callback){
      console.log('ASYNC LOOP INSIDE', purchaseElement);
      var insert_sql_query = "INSERT INTO inv_purchase_details (purchaseId, billNo, productId, quantity, price, totalPrice) VALUES ('"+resolve+"', '"+req.body.currentBillNo+"', '"+purchaseElement.id+"', '"+purchaseElement.productQuantity+"', '"+purchaseElement.productPrice+"', '"+purchaseElement.totalPrice+"')";
      console.log(insert_sql_query);
      dbConnection.query(insert_sql_query, function(err, results, fields){
        if(!err){
          console.log("Query Results : ", results);
          inner_callback(null);
        } else {
          console.log("Error while performing Query");
          inner_callback(err);
        };
      });
    }, function(err){
      if(err){
        console.log('ASYNC loop error !');
        return res.send({success: false, error: err});
      }else{
        console.log('Successfully inserted into inv_purchase_details table');
        return res.send({success: true, message: 'Successfully inserted into inv_purchase_details table'});
      }
    });
    
    // return res.send({success: false});
    
  }).catch(function (reject) {
    console.log('Promise rejected', reject);
    return res.send({success: false, error: err});
  });
  
  // return res.send({ success: true, message: 'purchase inserted !' });
});

app.post('/api/user-login', (req, res) => {
  console.log('User Name : ', req.body.username);
  console.log('User Password : ', req.body.password);
  
  var sessionStorage = '';
  
  select_sql_query = "SELECT username,email,user_status,employee_id,user_type FROM user WHERE username='"+req.body.username+"' AND password='"+req.body.password+"'";
  
  console.log('QUERY : ', select_sql_query);
  
  dbConnection.query(select_sql_query, function (error, results) {
    console.log("results",results);
    if (results.length > 0) {
      req.session.username = results[0].username;
      req.session.email = results[0].email;
      req.session.user_status = results[0].user_status;
      req.session.employee_id = results[0].employee_id;
      req.session.user_type = results[0].user_type;
      sessionStorage = req.session;
      
      console.log(req.session);
      var success = true;
    }
    else {
      var success = false;
    }
    if (error) throw error;
    return res.send({ error: error, success: success, session: sessionStorage, message: 'sepecification name list.' });
  });
});

app.get('/api/parent-category', (req, res) => {
  console.log('User Name : ', req.body.username);
  console.log('User Password : ', req.body.password);
  
  var sessionStorage = '';
  
  select_sql_query = "SELECT * FROM category WHERE parent_category_id='0'";
  
  console.log('QUERY : ', select_sql_query);
  
  dbConnection.query(select_sql_query, function (error, results) {
    console.log("results",results);
    if (results.length > 0) {
      return res.send({ success: true, data: results,  message: 'successfully get the information from category' });
    }
    else {
      return res.send({ error: error, data: [],  message: 'Did not able to feltch from category table' });
    }
  });
  
});

app.get('/api/child-category', (req, res) => {
  console.log('Parent Category : ', req.query.id);
  
  select_sql_query = "SELECT * FROM category WHERE parent_category_id='"+req.query.id+"'";
  
  console.log('QUERY : ', select_sql_query);
  
  dbConnection.query(select_sql_query, function (error, results) {
    console.log("results",results);
    if (results.length > 0) {
      return res.send({ success: true, data: results,  message: 'successfully get the information from category' });
    }
    else {
      return res.send({ error: error, data: [],  message: 'Did not able to feltch from category table' });
    }
  });
  
  // return res.send({ success: true, message: 'successfully get the information from category' });
  
});

app.get('/api/user-logout', async function (req, res) {
  console.log('before logout : ', req.session);
  console.log('request username outside of the condition : ', req.query.id);
  console.log('session username outside of the condition : ', req.session.username);
  if (req.session.username != undefined) {
    if (req.session.username.match(req.query.id)) {
      console.log('session username : ', req.session.username);
      console.log('request username : ', req.query.id);
  
      req.session.destroy(function(error) {
        if (error) throw error;
        if (!error){
          var success = true;
          var error = '';
        }
        else {
          var success = false;
        }
        console.log('Logout API Result success : '+success+' : error : '+error+' : seesion status : '+req.session);
        return res.send({ error: error, success: success, message: 'Error to logout.' });
      });
    }
  }
  else {
    return res.send({ error: 'error', success: false, message: 'Error to logout.' });
  }
  
  // return res.send({ success: true, message: 'Error to logout.' });
});


app.post('/api/vendor-details-personal', (req, res) => {
  
  console.log('Personal Details : ', req.body);
  
  new Promise (function (resolve, reject) {
    
    select_sql_query = "SELECT * FROM vendor_details WHERE vendor_id='"+req.body.vendorId+"' AND status='1'";
    
    console.log('QUERY : ', select_sql_query);
    
    dbConnection.query(select_sql_query, function (error, results) {
      console.log("results",results);
      
      if (results.length > 0) {
        resolve('update');
      }
      else {
        resolve('insert');
      }
    });
    
  }).then( function (resolve) {
    console.log(resolve);
    
    if ( resolve == 'insert' ) {
      
      try {
        var insert_sql_query = "INSERT INTO vendor_details (mobile, nid, dob, present_address, vendor_id, step_completed, status) VALUES ('"+req.body.mobileNumber+"', '"+req.body.nationalIdName+"', '"+req.body.dateOfBirthName+"', '"+req.body.presentAddress+"', '"+req.body.vendorId+"', 'step_one', '1')";
        
        dbConnection.query(insert_sql_query, function (err, result) {
          console.log('vendor_details insert result : ', result);
          console.log('vendor_details error result : ', err);
          if (result) {
            console.log("1 record inserted to vendor_details");
            return res.send({success: true, message: '1 record inserted to vendor_details', result: result});
          }
          else {
            console.log('Error to inseret at user : ', err);
            return res.send({success: false, message: 'Error occured to insert data at vendor_details', error: err});
          }
        });
      }
      catch (error) {
        if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
      }
      
    }
    else if (resolve == 'update') {
      console.log('Update needed : ', req.body);
      
      try {
        
        var update_sql_query = "UPDATE vendor_details SET  mobile = '"+req.body.mobileNumber+"', nid = '"+req.body.nationalIdName+"', dob = '"+req.body.dateOfBirthName+"', present_address = '"+req.body.presentAddress+"', vendor_id = '"+req.body.vendorId+"' WHERE vendor_id = '"+req.body.vendorId+"' AND status = '1'";
        
        console.log(update_sql_query);
        
        // return res.send({success: true, message: 'recored updated'});
        
        dbConnection.query(update_sql_query, function (err, result) {
          console.log(result);
          console.log(err);
          
          // return res.send({ success: true, message: 'Personal Details Successfully Updated !'});
          
          if (result) {
            console.log("1 record updated at vendor_details");
            return res.send({ success: true, message: update_sql_query});
          }
          else if (err) {
            console.log("Error to update at vendor_details : ", err);
            return res.send({ success: false, message: 'Personal Details Update failed !'});
          }
          
          // return res.send({ success: true});
        });
        
      }
      catch (error) {
        console.log('Error : ', error);
        if (error) return res.send({success: false, message: 'catched', error: 'Error has occured at the time of update data to PRODUCTS table', request : req.body});
      }
      
      // return res.send({ success: true, message: 'Personal Details Successfully Updated !'});
      
    }
    else{
      
      reject('rejected');
    }
    
  }).catch(function (reject) {
    console.log('Promise rejected', reject);
  });
  
  // return res.send({ success: true, message: 'Personal Details Successfully Inserted !'});
  
});

app.get('/api/specialCategoryListForCategory', async function(req, res, next) {
  const parentAndChild = [];
  const parentAndChildRelation = [];
  let relationIndex = 0;
  console.log('special Category List For Specification');
  const category_name = await query('SELECT * FROM category');
  for ( const i in category_name ) {
    if (category_name[i].parent_category_id == 0) {
      parentAndChild[category_name[i].id] = category_name[i].category_name;
    }
    for ( const j in parentAndChild ) {
      if (category_name[i].parent_category_id == j) {
        parentAndChild[category_name[i].id] = parentAndChild[j]+'->'+category_name[i].category_name;
        ++relationIndex;
        parentAndChildRelation[relationIndex] = parentAndChild[category_name[i].id]
      }
    }
  }
  for ( const i in unique(parentAndChildRelation) ) {
    delete parentAndChild[parentAndChildRelation[i]];
  }
  for ( const i in parentAndChild ) {
    console.log('Consoling Chid Category : ','index : '+i+' value : '+parentAndChild[i]);
  }
  return res.send({ data: parentAndChild, message: 'category list.' });
});

app.get('/api/getVendorWiseProductList', (req, res) => {
  dbConnection.query("SELECT COUNT(id) AS count_id FROM products WHERE vendor_id = '"+req.query.id+"' AND status = 'active'", function (error, results, fields) {
    console.log(results[0].count_id);
    var count_product = Number(results[0].count_id) + Number(1);
    console.log(count_product);
    var SKU_part = 'BNJ-000'+req.query.id+'-0000'+count_product;
    if (error) throw error;
    return res.send({ error: error, data: SKU_part, message: 'vendor name list.' });
  });
});

app.post('/api/vendor-details-shop', (req, res) => {
  
  console.log('Business Details : ', req.body);
  
  try {
    
    var update_sql_query = "UPDATE vendor_details SET shop_language = '"+req.body.shopLanguageName+"', shop_country = '"+req.body.shopCountryName+"', shop_currency = '"+req.body.shopCurrencyName+"', your_description = '"+req.body.your_description+"', shop_name = '"+req.body.shopName+"', step_completed = 'step_two' WHERE vendor_id = '"+req.body.vendorId+"' AND status = '1'";
    
    dbConnection.query(update_sql_query, function (err, result) {
      console.log(result);
      console.log(err);
      
      // return res.send({ success: true, message: 'Personal Details Successfully Updated !'});
      
      if (result) {
        console.log("1 record updated at vendor_details");
        return res.send({ success: true, message: update_sql_query});
      }
      else if (err) {
        console.log("Error to update at vendor_details : ", err);
        return res.send({ success: false, message: 'Personal Details Update failed !'});
      }
      
      // return res.send({ success: true});
    });
    
  }
  catch (error) {
    console.log('Error : ', error);
    if (error) return res.send({success: false, message: 'catched', error: 'Error has occured at the time of update data to PRODUCTS table', request : req.body});
  }
  
  
});

app.post('/api/vendor-details-business', (req, res) => {
  console.log('Business Details : ', req.body);
  
  new Promise (function (resolve, reject) {
    try {
      var update_sql_query = "UPDATE vendor_details SET trade_licence = '"+req.body.tradeLicenceName+"', business_start_date = '"+req.body.businessStartDateName+"', tin = '"+req.body.tinName+"', business_address = '"+req.body.businessAddressName+"', web_address = '"+req.body.webAddressName+"', transaction_information = '"+req.body.transactionInformationName+"', bankName = '"+req.body.bank+"', account_name = '"+req.body.accountName+"', ac_no = '"+req.body.accountNo+"', branch = '"+req.body.branch+"', routing_no = '"+req.body.routingNo+"', vendor_category = '"+req.body.vendorCategoryName+"', product_category = '"+req.body.productCategoryName+"', product_sub_category = '"+req.body.productCategoryName+"', step_completed = 'approved' WHERE vendor_id = '"+req.body.vendorId+"' AND status = '1'";
      
      dbConnection.query(update_sql_query, function (err, result) {
        console.log(result);
        console.log(err);
        
        // return res.send({ success: true, message: 'Personal Details Successfully Updated !'});
        
        if (result) {
          console.log("step_three record updated at vendor_details");
          // return res.send({ success: true, message: update_sql_query});
          resolve('update user table');
        }
        else if (err) {
          console.log("Error to update at vendor_details : ", err);
          // return res.send({ success: false, message: 'Personal Details Update failed !'});
          reject('rejected');
        }
        
        // return res.send({ success: true});
      });
      
    }
    catch (error) {
      console.log('Error : ', error);
      if (error) return res.send({success: false, message: 'catched', error: 'Error has occured at the time of update data to PRODUCTS table', request : req.body});
    }
  }).then( function (resolve) {
    console.log('Need to update the user table !');
    try {
      var update_sql_query = "UPDATE user SET user_status = 'approved' WHERE employee_id = '"+req.body.vendorId+"' AND status = 'active'";
      
      dbConnection.query(update_sql_query, function (err, result) {
        console.log(result);
        console.log(err);
        
        // return res.send({ success: true, message: 'Personal Details Successfully Updated !'});
        
        if (result) {
          console.log("step_three record updated at vendor_details");
          return res.send({ success: true, message: 'Personal Details Update successfully !'});
        }
        else if (err) {
          console.log("Error to update at vendor_details : ", err);
          return res.send({ success: false, message: 'Personal Details Update failed !'});
        }
        
        // return res.send({ success: true});
      });
      
    }
    catch (error) {
      console.log('Error : ', error);
      if (error) return res.send({success: false, message: 'catched', error: 'Error has occured at the time of update data to PRODUCTS table', request : req.body});
    }
    // return res.send({ success: true });
    
  }).catch(function (reject) {
    console.log('Rejected !', reject);
    return res.send({ success: true });
  });
  
  
  // return res.send({ success: true, message: 'Business Details Successfully Inserted !'});
});


// app.post('/api/saveVendor', (req,res)=>{
//   console.log('The Request For Files: ', req.file);
//   console.log('The Request For Other Values: ', req.body);

//   // const file = req.file
//   // res.send(file)

//   // var tmp_path = req.file.path;
//   // var target_path = 'uploads/' + req.file.filename;

//   // console.log('tmp path : ', tmp_path);
//   // console.log('target path : ', target_path);

//   // var src = fs.createReadStream(tmp_path);
//   // console.log(src);
//   // var dest = fs.createWriteStream(target_path);
//   // src.pipe(dest);

//   // src.on('end', function() { return res.send({success: true, request:req.body}); });
//   // src.on('error', function(err) { return res.send({success: false, request:req.body}); });

//   // return res.send({success: true, request:req.body});

//   try {
//     var insert_sql_query = "INSERT INTO vendor (name, email, website, address, status) VALUES ('"+req.body.name+"', '"+req.body.email+"', '"+req.body.website+"', '"+req.body.address+"', '1' )";

//     dbConnection.query(insert_sql_query, function (err, result) {

//       if (result) {
//         console.log("1 record inserted to category");
//         return res.send({success: true, server_message: result});
//       }
//       else {
//         console.log('Error to inseret at category : ', err);
//         return res.send({success: false, error: err});
//       }

//     });

//   }
//   catch (error) {
//     if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
//   }

// });

app.post('/api/saveVendor', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  else{
    
    try {
      const file = req.files.file;
      file.mv(`${__dirname}/../public/upload/vendor/personal/${file.name}`, err => {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }
      });
      var insert_sql_query = "INSERT INTO vendor (name, email, website, address,image, status) VALUES ('" + req.body.name + "', '" + req.body.email + "', '" + req.body.website + "', '" + req.body.address + "','" + file.name + "', '1' )";
      dbConnection.query(insert_sql_query, function (err, result) {
        
        if (result) {
          res.status(200).json({ message: 'success' });
        }
        else {
          console.log('Error to inseret at category : ', err);
          return res.send({ success: false, error: err });
        }
      });
      
      // let sampleFile = [];
      // sampleFile = req.files.file;
      // sampleFile.map(function(file,index){
      //       file.mv(`${__dirname}/../public/upload/vendor/${file.name}`, err => {
      //         if (err) {
      //           console.error(err);
      //           return res.status(500).send(err);
      //         }
      //       });
      //       console.log(file.fileName);
      //     })
      
      
    }
    catch (error) {
      if (error) return res.send({ success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request: req.body });
    }
  }
});


app.post('/api/saveSpecification',(req,res)=>{
  values = req.body.values;
  var valuesArray = values.split(" ");
  
  console.log('The Request values : ', req.body.ProductSpecificationValuesArray);
  console.log('The Request values json formate : ', JSON.stringify(req.body.ProductSpecificationValuesArray));
  console.log('The Request name : ', req.body.name);
  console.log('The Request categoryId : ', req.body.categoryId);
  
  // return res.send({success: true});
  
  try {
    var insert_sql_query = "INSERT INTO product_specification_names (specification_name, category_id, value, status) VALUES ('"+req.body.name+"', '"+req.body.categoryId+"', '"+JSON.stringify(req.body.ProductSpecificationValuesArray)+"', '1' )";
    
    dbConnection.query(insert_sql_query, function (err, result) {
      
      if (result) {
        console.log("1 record inserted to category");
        return res.send({success: true, server_message: result});
      }
      else {
        console.log('Error to inseret at category : ', err);
        return res.send({success: false, error: err});
      }
      
    });
    
  }
  catch (error) {
    if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
  }
  
});

// app.post('/api/saveSpecificationDetails',(req,res)=>{
//   values = req.body.specification_details_name;
//   // var valuesArray = values.split(" ");
  
//   console.log('The Request : ', req.body.ProductSpecificationValuesArray);
  
//   // return res.send({success: true});
  
//   try {
//     var insert_sql_query = "INSERT INTO product_specification_details (category_id, specification_details_name, status) VALUES ('"+req.body.categoryId+"', '"+JSON.stringify(req.body.ProductSpecificationValuesArray)+"', '1' )";
    
//     dbConnection.query(insert_sql_query, function (err, result) {
      
//       if (result) {
//         console.log("1 record inserted to category");
//         return res.send({success: true, server_message: result});
//       }
//       else {
//         console.log('Error to inseret at category : ', err);
//         return res.send({success: false, error: err});
//       }
      
//     });
    
//   }
//   catch (error) {
//     if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
//   }
  
// });

app.post('/api/saveCategory',(req,res)=>{
  try {
    var insert_sql_query = "INSERT INTO category (category_name, description, parent_category_id, status) VALUES ('"+req.body.categoryName+"', '"+req.body.categoryDescription+"', '"+req.body.parentCategory+"', '"+req.body.isActive+"')";
    dbConnection.query(insert_sql_query, function (err, result) {
      
      if (result) {
        console.log("1 record inserted to category");
        return res.send({success: true, server_message: result});
      }
      else {
        console.log('Error to inseret at category : ', err);
        return res.send({success: false, server_message: err});
      }
    });
  }
  catch (error) {
    if (error) return res.send({error: 'Error has occured at the time of insert data to CATEGORY table', request : req.body});
  }
  
  console.log(req);
});


app.get('/api/search_filter_products', (req, res) => {
  console.log('Vendor Values : ', req.query.vendorId);
  console.log('categoryList Values : ', req.query.categoryList);
  
  dbConnection.query('SELECT * FROM products WHERE vendor_id = "'+ req.query.vendorId +'" AND category_id = "'+req.query.categoryList+'"', function (error, results, fields) {
    
    if (error) throw error;
    return res.send({ data: results, message: 'data' });
    
  });
  
  // return res.send({ success: 'true', data: req.query.id, message: 'data' });
  
});

app.get('/api/search_purchase_products', (req, res) => {
  console.log('Vendor Values : ', req.query.vendorId);
  console.log('Vendor Values : ', req.query.id);
  
  var searchedProducts = [];
  
  new Promise (function (resolve, reject) {
    
    dbConnection.query('SELECT id FROM products WHERE vendor_id = "'+ req.query.vendorId +'" AND product_name LIKE "%'+ req.query.id +'%" OR product_sku LIKE "%'+ req.query.id +'%" ', function (error, results, fields) {
      console.log(results);
      if (error) throw error;
      // return res.send({ data: results, message: 'data' });
      if (results.length > 0) {
        resolve(results);
      }
      else {
        reject('rejected');
      }
      
    });
    
  }).then( function (purchaseElements) {
    console.log(purchaseElements);
    
    async.forEachOf(purchaseElements, function (purchaseElement, i, inner_callback){
      
      var select_sql = "SELECT products.id AS id, products.product_name AS product_name, products.product_sku AS product_sku FROM products JOIN inv_purchase_details ON products.id = inv_purchase_details.productId WHERE products.id='"+purchaseElement.id+"' AND inv_purchase_details.productId='"+purchaseElement.id+"' ";
      
      
      
      dbConnection.query(select_sql, function(err, results, fields){
        if(!err){
          if (results.length > 0) {
            searchedProducts.push(results);
          }
          
          inner_callback(null);
        } else {
          console.log("Error while performing Query");
          inner_callback(err);
        };
      });
    }, function(err){
      if(err){
        //handle the error if the query throws an error
        console.log('Error at ASYNC');
        return res.send({ data: [], message: 'data' });
      }else{
        //whatever you wanna do after all the iterations are done
        console.log('Success at ASYNC');
        return res.send({ data: searchedProducts, message: 'data' });
      }
    });
    
  }).catch(function (reject) {
    console.log('Rejected');
    return res.send({ data: [], message: 'data' });
  })
  
  // return res.send({ success: 'true', data: req.query.id, message: 'data' });
  
});

app.get('/api/bill_no', (req, res) => {
  console.log('Vendor Id for Bill_No : ', req.query.vendorId);
  
  dbConnection.query('SELECT COUNT(id) AS count_id FROM inv_purchase WHERE supplierId = "'+ req.query.vendorId +'" AND status = "1" ', function (error, results, fields) {
    
    if (error) throw error;
    return res.send({ success: true, data: results, message: 'data' });
    
  });
  
  // return res.send({ success: 'true', data: req.query.id, message: 'data' });
  
});

app.get('/api/purchase_list', (req, res) => {
  console.log('Vendor Id for Bill_No : ', req.query.id);
  
  dbConnection.query('SELECT * FROM inv_purchase WHERE supplierId = "'+ req.query.id +'" AND status = "1" ', function (error, results, fields) {
    console.log('Purchase Bill List : ', results);
    if (error) throw error;
    return res.send({ success: true, data: results, message: 'data' });
    
  });
  
  app.post('/api/saveSalesReturn', (req, res) => {
    console.log('Sales Return Request : ', req.body);
    
    var purchase_table_id = 0;
    var purchaseListArray = [];
    
    promise = new Promise (function (resolve, reject) {
      
      try {
        var insert_sql_query = "INSERT INTO sales_return (salesReturnBillNo, salesBillId, customerId, salesDate, salesReturnDate, totalSalesReturnQuantity, totalSalesReturnAmount, totalSalesPayAmount, salesReturnPayAmount, status) VALUES ('"+req.body.purchaseReturnNo+"', '"+req.body.sales_bill_id+"', '"+req.body.customer_id+"', '"+req.body.sales_date+"', '"+req.body.purchaseReturnDate+"',        '"+req.body.grandTotalQuantity+"', '"+req.body.grandTotalPrice+"', '"+req.body.sales_pay_amount+"', '"+req.body.totalReturnAmount+"', '1')";
        
        dbConnection.query(insert_sql_query, function (err, result) {
          console.log('user insert result : ', result.insertId);
          console.log('user error result : ', err);
          if (result) {
            console.log("1 record inserted to user");
            // return res.send({success: true, server_message: result});
            resolve(result.insertId);
          }
          else {
            console.log('Error to inseret at user : ', err);
            return res.send({success: false, error: err});
          }
        });
      }
      catch (error) {
        if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
      }
      
    }).then( function (resolve) {
      
      purchaseElements = req.body.PurchaseList;
      
      async.forEachOf(purchaseElements, function (purchaseElement, i, inner_callback){
        
        var insert_sql_query = "INSERT INTO sales_return_details (salesReturnId, salesReturnDate, productId, salesReturnQuantity, totalAmount, status) VALUES ('"+resolve+"', '"+req.body.purchaseReturnDate+"', '"+purchaseElement.id+"', '"+purchaseElement.productQuantity+"', '"+purchaseElement.totalPrice+"', '1')";
        
        dbConnection.query(insert_sql_query, function(err, results, fields){
          if(!err){
            console.log("Query Results : ", results);
            inner_callback(null);
          } else {
            console.log("Error while performing Query");
            inner_callback(err);
          };
        });
      }, function(err){
        if(err){
          console.log('ASYNC loop error !');
          return res.send({success: false, error: err});
        }else{
          console.log('Successfully inserted into inv_purchase_details table');
          return res.send({success: true, message: 'Successfully inserted into inv_purchase_details table'});
        }
      });
      
    }).catch(function (reject) {
      console.log('Promise rejected', reject);
      return res.send({success: false, error: err});
    });
    
    // return res.send({success: false, message: 'Successfully inserted into inv_purchase_details table'});
    
  });
  app.post('/api/saveProductPurchaseReturn', (req, res) => {
    console.log('Product Purchase : ', req.body);
    
    var purchase_table_id = 0;
    var purchaseListArray = [];
    
    promise = new Promise (function (resolve, reject) {
      
      try {
        var insert_sql_query = "INSERT INTO inv_purchase_return (purchaseReturnBillNo, supplierId, purchaseReturnDate, totalQuantity, totalAmount, status) VALUES ('"+req.body.purchaseReturnNo+"', '"+req.body.vendorIdForPurchase+"', '"+req.body.purchaseReturnDate+"', '"+req.body.grandTotalQuantity+"', '"+req.body.grandTotalPrice+"', '1')";
        
        dbConnection.query(insert_sql_query, function (err, result) {
          console.log('user insert result : ', result.insertId);
          console.log('user error result : ', err);
          if (result) {
            console.log("1 record inserted to user");
            // return res.send({success: true, server_message: result});
            resolve(result.insertId);
          }
          else {
            console.log('Error to inseret at user : ', err);
            return res.send({success: false, error: err});
          }
        });
      }
      catch (error) {
        if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
      }
      
    })/*.then( function (resolve) {
      
      select_sql_query = "SELECT id FROM inv_purchase WHERE billNo='"+req.body.currentBillNo+"'";
      
      console.log('QUERY : ', select_sql_query);
      
      console.log(resolve);
      
      // dbConnection.query(select_sql_query, function (error, results) {
      //   console.log("results",results);
      //   if (results.length > 0) {
      //     purchase_table_id = results[0].id;
      //     return purchase_table_id;
      //   }
      //   else {
      //     var success = false;
      //     return res.send({success: false, error: err});
      //   }
      // });
      
      dbConnection.query(select_sql_query, function (error, results) {
        console.log("results",results);
        console.log("results",results.length);
        if (results.length > 0) {
          var success = true;
          console.log('Purchase ID : ', results[0].id);
          purchase_table_id = results[0].id;
          return results[0].id;
        }
        else {
          var success = false;
        }
        if (error) throw error;
        
      });
      
    })*/.then( function (resolve) {
      console.log('returned value form previous state : ', resolve);
      console.log('purchase_table_id form previous state : ', purchase_table_id);
      purchaseElements = req.body.PurchaseList;
      console.log('ASYNC LOOP OUTSIDE');
      async.forEachOf(purchaseElements, function (purchaseElement, i, inner_callback){
        console.log('ASYNC LOOP INSIDE', purchaseElement);
        var insert_sql_query = "INSERT INTO inv_purchase_return_details (purchaseReturnId, purchaseReturnBillNo, productId, quantity, price, totalPrice, status) VALUES ('"+resolve+"', '"+req.body.purchaseReturnNo+"', '"+purchaseElement.id+"', '"+purchaseElement.productQuantity+"', '"+purchaseElement.productPrice+"', '"+purchaseElement.totalPrice+"', '1')";
        console.log(insert_sql_query);
        dbConnection.query(insert_sql_query, function(err, results, fields){
          if(!err){
            console.log("Query Results : ", results);
            inner_callback(null);
          } else {
            console.log("Error while performing Query");
            inner_callback(err);
          };
        });
      }, function(err){
        if(err){
          console.log('ASYNC loop error !');
          return res.send({success: false, error: err});
        }else{
          console.log('Successfully inserted into inv_purchase_details table');
          return res.send({success: true, message: 'Successfully inserted into inv_purchase_details table'});
        }
      });
      
      // return res.send({success: false});
      
    }).catch(function (reject) {
      console.log('Promise rejected', reject);
      return res.send({success: false, error: err});
    });
    
    // return res.send({ success: true, message: 'purchase inserted !' });
  });
  
  // return res.send({ success: 'true', data: req.query.id, message: 'data' });
  
});

app.get('/api/purchase_return_no', (req, res) => {
  
  dbConnection.query('SELECT COUNT(id) AS count_id FROM inv_purchase_return WHERE status = "1" ', function (error, results, fields) {
    
    if (error) throw error;
    return res.send({ success: true, data: results, message: 'data' });
    
  });
  
  // return res.send({ success: 'true', data: req.query.id, message: 'data' });
  
});

app.get('/api/sales_return_no', (req, res) => {
  
  dbConnection.query('SELECT COUNT(id) AS count_id FROM sales_return WHERE status = "1" ', function (error, results, fields) {
    
    if (error) throw error;
    return res.send({ success: true, data: results, message: 'data' });
    
  });
  
  // return res.send({ success: 'true', data: req.query.id, message: 'data' });
  
});

app.get('/api/search_sales_products_bill_no', (req, res) => {
  
  dbConnection.query('SELECT * FROM sales WHERE bill_no LIKE "%'+ req.query.id +'%" AND status = "1" ', function (error, results, fields) {
    
    if (error) throw error;
    return res.send({ success: true, data: results, message: 'data' });
    
  });
  
});

app.get('/api/search_sales_products', (req, res) => {
  
  var searchedProducts = [];
  
  new Promise (function (resolve, reject) {
    
    dbConnection.query('SELECT id FROM products WHERE product_name LIKE "%'+ req.query.id +'%" OR product_sku LIKE "%'+ req.query.id +'%" ', function (error, results, fields) {
      console.log(results);
      if (error) throw error;
      // return res.send({ data: results, message: 'data' });
      if (results.length > 0) {
        resolve(results);
      }
      else {
        reject('rejected');
      }
      
    });
    
  }).then( function (purchaseElements) {
    console.log(purchaseElements);
    
    async.forEachOf(purchaseElements, function (purchaseElement, i, inner_callback){
      
      var select_sql = "SELECT products.id AS id, products.product_name AS product_name, products.product_sku AS product_sku FROM products JOIN sales_details ON products.id = sales_details.product_id WHERE products.id='"+purchaseElement.id+"' AND sales_details.product_id ='"+purchaseElement.id+"' AND sales_details.sales_bill_no_id ='"+req.query.bill_no_id+"' ";
      
      dbConnection.query(select_sql, function(err, results, fields){
        if(!err){
          if (results.length > 0) {
            searchedProducts.push(results);
          }
          
          inner_callback(null);
        } else {
          console.log("Error while performing Query");
          inner_callback(err);
        };
      });
    }, function(err){
      if(err){
        //handle the error if the query throws an error
        console.log('Error at ASYNC');
        return res.send({ data: [], message: 'data' });
      }else{
        //whatever you wanna do after all the iterations are done
        console.log('Success at ASYNC');
        return res.send({ data: searchedProducts, message: 'data' });
      }
    });
    
  }).catch(function (reject) {
    console.log('Rejected');
    return res.send({ data: [], message: 'data' });
  })
  
});

app.get('/api/feature_name', (req, res) => {
  dbConnection.query('SELECT * FROM feature_name', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'category list.' });
  });
});

app.get('/api/feature_products_list', (req, res) => {
  dbConnection.query('SELECT feature_products.id AS id, feature_products.feature_id AS feature_id, feature_products.feature_products AS feature_products, feature_name.name AS name, feature_products.status AS status FROM feature_products JOIN feature_name ON feature_products.feature_id=feature_name.id WHERE feature_products.status=1', function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'category list.' });
  });
});

app.get('/api/search_feature_products', (req, res) => {
  console.log('Vendor Values : ', req.query.vendorId);
  console.log('Searched Text : ', req.query.id);
  console.log('categoryList Values : ', req.query.categoryList);
  
  dbConnection.query('SELECT * FROM products WHERE vendor_id = "'+ req.query.vendorId +'" AND category_id = "'+req.query.categoryList+'" AND product_name LIKE "%'+ req.query.id +'%" OR product_sku LIKE "%'+ req.query.id +'%" ', function (error, results, fields) {
    
    if (error) throw error;
    return res.send({ data: results, message: 'data' });
    
  });
  
  // return res.send({ success: 'true', data: req.query.id, message: 'data' });
  
});

// app.post('/api/save_feature_products',(req,res)=>{
  
//   try {
//     var insert_sql_query = "INSERT INTO feature_products (feature_id, feature_products) VALUES ('"+req.body.featureName+"', '"+JSON.stringify(req.body.PurchaseList)+"')";
    
//     dbConnection.query(insert_sql_query, function (err, result) {
      
//       if (result) {
//         console.log("1 record inserted to category");
//         return res.send({success: true, server_message: result});
//       }
//       else {
//         console.log('Error to inseret at category : ', err);
//         return res.send({success: false, server_message: err});
//       }
      
//     });
//   }
//   catch (error) {
//     if (error) return res.send({error: 'Error has occured at the time of inserting data to CATEGORY table', request : req.body});
//   }
  
//   console.log(req);
// });

app.post('/api/saveFeatureName',(req,res)=>{
  
  try {
    var insert_sql_query = "INSERT INTO feature_name (name) VALUES ('"+req.body.featureName+"')";
    
    dbConnection.query(insert_sql_query, function (err, result) {
      
      if (result) {
        console.log("1 record inserted to category");
        return res.send({success: true, server_message: result});
      }
      else {
        console.log('Error to inseret at category : ', err);
        return res.send({success: false, server_message: err});
      }
      
    });
  }
  catch (error) {
    if (error) return res.send({error: 'Error has occured at the time of insert data to CATEGORY table', request : req.body});
  }
  
  console.log(req);
});

app.get('/api/feature_name', (req, res) => {
  dbConnection.query('SELECT * FROM feature_name', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'category list.' });
  });
});

app.get('/api/getTermsAndCondition', async function (req, res)  {
  const selected_terms_and_condition = await query('SELECT * FROM terms_conditions');
  console.log('selected users : ', selected_terms_and_condition);
  return res.send({ data: selected_terms_and_condition });
});
app.post('/api/saveTermsAndCondition', async function (req, res)  {
  var terms_and_conditions = '';
  var new_terms_and_conditions = "'"+req.body.termsCondition+"'";
  if (req.body.termsAndCondition.length > 0) {
    var terms_and_conditions = "'"+req.body.termsAndCondition[0].terms_and_conditions+"'";
  }
  const selected_terms_and_condition_count = await query('SELECT COUNT(terms_and_conditions) AS terms_and_conditions FROM terms_conditions');
  if (selected_terms_and_condition_count[0].terms_and_conditions > 0) {
    const delete_previous_terms_and_conditions = await query('DELETE FROM terms_conditions');
  }
  
  const saved_terms_and_condition = await query("INSERT INTO terms_conditions (terms_and_conditions) VALUES ("+new_terms_and_conditions+")");
  const selected_terms_and_condition = await query('SELECT * FROM terms_conditions');
  return res.send({ success: true, result: saved_terms_and_condition, data: selected_terms_and_condition });
});

app.get('/api/deleteProductInfo', async function (req, res)  {
  const product_tmp_sells_table_check = await query('SELECT COUNT(id) FROM temp_sell  WHERE item_ids = '+ req.query.id);
  const product_purchase_details_table_check = await query('SELECT COUNT(id) FROM inv_purchase_details  WHERE productId = '+ req.query.id);
  const product_purchase_return_details_table_check = await query('SELECT COUNT(id) FROM inv_purchase_return_details  WHERE productId = '+ req.query.id);
  const product_sells_details_table_check = await query('SELECT COUNT(id) FROM sales_details  WHERE product_id = '+ req.query.id);
  const product_sells_return_details_table_check = await query('SELECT COUNT(id) FROM sales_return_details  WHERE productId = '+ req.query.id);
  if (product_tmp_sells_table_check > 0 || product_purchase_details_table_check > 0 || product_purchase_return_details_table_check > 0 || product_sells_details_table_check > 0 || product_sells_return_details_table_check > 0) {
    console.log('Product delete working', req.query.id);
    return res.send({ success: false, message: 'Product has aasigned somewhere else !' });
  }
  else {
    const product_specification_details = await query('UPDATE products SET SoftDelete = 1 WHERE id = '+ req.query.id);
    console.log('Product delete working', req.query.id);
    return res.send({ success: true, message: 'Product has successfully deleted !' });
  }
  // return res.send({ success: true, message: 'Product has successfully deleted !' });
});
app.get('/api/allProducts', (req, res) => {
  dbConnection.query('SELECT * FROM products WHERE softDelete = 0 ORDER BY id DESC', function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'product list.' });
  });
});
app.get('/api/product_list', (req, res) => {
  console.log('Session Values : ', req.query.id);
  dbConnection.query('SELECT employee_id, user_type FROM user WHERE username="'+ req.query.id +'"', function (error, results, fields) {
    console.log('User Type : ', results[0].user_type);
    if (error) throw error;
    if (results[0].user_type == 'vendor') {
      vendor_products (results[0].employee_id, res);
    }
    else {
      admin_products (res);
    }
  });
});
function vendor_products (vendor_id, res) {
  console.log('Inside the vendor_products function & vendor is : ', vendor_id);
  dbConnection.query('SELECT * FROM products WHERE softDelete = 0 AND vendor_id = "'+ vendor_id +'" ORDER BY id DESC', function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'sepecification name list.' });
  });
}
function admin_products (res) {
  dbConnection.query('SELECT * FROM products WHERE softDelete = 0 ORDER BY id DESC', function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    // return results;
    return res.send({ error: error, data: results, message: 'sepecification name list.' });
  });
}

app.get('/api/deleteSpecificationDelete', async function (req, res)  {
  const product_specification_details = await query('UPDATE product_specification_details SET SoftDel = 1 WHERE id = '+ req.query.id);
  console.log('Specification Details delete working', req.query.id);
  return res.send({ success: true, message: 'sepecification details successfully deleted !' });
});

app.get('/api/specialCategoryListForSpecification', async function(req, res, next) {
    const parentAndChild = [];
    const parentAndChildRelation = [];
    let relationIndex = 0;
    console.log('special Category List For Specification');
    const category_name = await query('SELECT * FROM category');
    for ( const i in category_name ) {
      if (category_name[i].parent_category_id == 0) {
        parentAndChild[category_name[i].id] = category_name[i].category_name;
      }
      for ( const j in parentAndChild ) {
        if (category_name[i].parent_category_id == j) {
          parentAndChild[category_name[i].id] = parentAndChild[j]+'->'+category_name[i].category_name;
          ++relationIndex;
          parentAndChildRelation[relationIndex] = category_name[i].parent_category_id;
        }
      }
    }
    for ( const i in unique(parentAndChildRelation) ) {
      delete parentAndChild[parentAndChildRelation[i]];
    }
    for ( const i in parentAndChild ) {
      console.log('Consoling Chid Category : ','index : '+i+' value : '+parentAndChild[i]);
    }
    return res.send({ data: parentAndChild, message: 'category list.' });
  });
app.get('/api/product_specification_details', async function (req, res)  {
  const product_specification_details = await query('SELECT * FROM product_specification_details WHERE status="active" AND softDel = 0 ORDER BY id DESC LIMIT 5');
  const product_specification_details_count = await query('SELECT COUNT(id) AS specification_details_count FROM product_specification_details WHERE status="active" AND softDel = 0');
  console.log('Product Specification Count is : ', product_specification_details_count[0].specification_details_count);
  return res.send({ data: product_specification_details, specification_details_count: product_specification_details_count[0].specification_details_count, message: 'sepecification name list.' });
});
app.get('/api/details_specification_paginate', async function (req, res)  {
  console.log('Rows Values : ', req.query.rows);
  console.log('Page Number : ', req.query.page_number);
  console.log('Field Name : ', req.query.field_name);
  var offset_value = ((Number(req.query.rows) * Number(req.query.page_number)) - Number(req.query.rows));
  console.log('Offset Values is : ', offset_value);
  if (req.query.field_name == 'search') {
    console.log('Search Value is : ', req.query.search_value)
    const product_specification_details = await query("SELECT product_specification_details.id AS id, product_specification_details.category_id AS category_id, product_specification_details.specification_details_name, product_specification_details.status FROM product_specification_details JOIN category ON product_specification_details.category_id = category.id WHERE product_specification_details.softDel = 0 AND product_specification_details.status='active' AND category.category_name LIKE '%"+req.query.search_value+"%' ORDER BY product_specification_details.id DESC LIMIT "+req.query.rows+" OFFSET "+offset_value);
    const product_specification_details_count = await query('SELECT COUNT(id) AS specification_details_count FROM product_specification_details WHERE softDel = 0 AND status="active"');
    console.log('Product Specification Count is : ', product_specification_details_count[0].specification_details_count);
    console.log('Product Specification details value : ', product_specification_details);
    console.log('Query : ', "SELECT product_specification_details.id AS id, product_specification_details.category_id AS category_id, product_specification_details.specification_details_name, product_specification_details.status FROM product_specification_details JOIN category ON product_specification_details.category_id = category.id WHERE product_specification_details.softDel = 0 AND product_specification_details.status='active' AND category.category_name='%"+req.query.search_value+"%' ORDER BY product_specification_details.id DESC LIMIT "+req.query.rows+" OFFSET "+offset_value);
    return res.send({ data: product_specification_details, specification_details_count: product_specification_details_count[0].specification_details_count, message: 'sepecification name list.' });
  }
  else {
    const product_specification_details = await query("SELECT * FROM product_specification_details WHERE softDel = 0 AND status='active' ORDER BY id DESC LIMIT "+req.query.rows+" OFFSET "+offset_value);
    const product_specification_details_count = await query('SELECT COUNT(id) AS specification_details_count FROM product_specification_details WHERE softDel = 0 AND status="active"');
    console.log('Product Specification Count is : ', product_specification_details_count[0].specification_details_count);
    console.log('Product Specification details value : ', product_specification_details);
    return res.send({ data: product_specification_details, specification_details_count: product_specification_details_count[0].specification_details_count, message: 'sepecification name list.' });
  }
});
app.get('/api/get_individual_specification_details', async function (req, res)  {
  const product_specification_details = await query('SELECT * FROM product_specification_details WHERE SoftDel = 0 AND status="active" AND id ='+req.query.id);
  return res.send({ data: product_specification_details, message: 'sepecification name list.' });
});

app.post('/api/updateSpecificationDetails', async function (req, res)  {
  const product_specification_detail = await query("UPDATE product_specification_details SET specification_details_name = '"+JSON.stringify(req.body.ProductSpecificationValuesArray)+"' WHERE id= '"+req.body.getUpdateID+"'");
  const product_specification_details = await query('SELECT * FROM product_specification_details WHERE status="active" AND softDel = 0 ORDER BY id DESC LIMIT 5');
  const product_specification_details_count = await query('SELECT COUNT(id) AS specification_details_count FROM product_specification_details WHERE status="active"');
  console.log('Product Specification Count is : ', product_specification_details_count[0].specification_details_count);
  console.log('api updateSpecificationDetails working !', JSON.stringify(req.body.ProductSpecificationValuesArray));
  console.log('api updateSpecificationDetails working !', req.body.deleteOrUpdateId);
  return res.send({ success: true, result: product_specification_detail, data: product_specification_details, specification_details_count: product_specification_details_count[0].specification_details_count, message: 'sepecification details updated.' });
});

app.get('/api/delete_feature_products', async function (req, res)  {
  const delete_feature_products = await query('DELETE FROM feature_products WHERE id='+req.query.id);
  console.log(delete_feature_products);
  console.log(req.query.id);
  return res.send({ success: true, message: delete_feature_products });
});

app.get('/api/get_feature_products_for_update', (req, res) => {
  dbConnection.query("SELECT * FROM feature_products WHERE id = '"+req.query.id+"'", function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'category list.' });
  });
});

app.post('/api/update_feature_products', async function (req, res)  {
  var jsonData = "'"+JSON.stringify(req.body.PurchaseList)+"'";
  console.log(jsonData);
  const product_specification_details = await query('UPDATE feature_products SET feature_products='+jsonData+' WHERE id='+req.body.updateFeatureProducts);
  return res.send({ success: true, message: 'sepecification name list.' });
});


app.post('/api/save_feature_products', async function (req,res) {
  const feature_products_is_exist = await query('SELECT COUNT(id) AS id_count FROM feature_products where feature_id = '+req.body.featureName+' AND status = 1');
  console.log('Feature Products is exist : ', feature_products_is_exist);
  if (feature_products_is_exist[0].id_count > 0) {
    const get_existing_feature_products = await query('SELECT feature_products FROM feature_products where feature_id = '+req.body.featureName+' AND status = 1');
    var newArrayForFeatureProducts = [];
    var parsedFeatureProducts = JSON.parse(get_existing_feature_products[0].feature_products);
    for (var i = 0; i < parsedFeatureProducts.length; i++) {
      newArrayForFeatureProducts.push(parsedFeatureProducts[i]);
    }
    for (var i = 0; i < req.body.PurchaseList.length; i++) {
      newArrayForFeatureProducts.push(req.body.PurchaseList[i]);
      console.log(newArrayForFeatureProducts);
    }
    var put_json_feature_product = "'"+JSON.stringify(newArrayForFeatureProducts)+"'";
    const update_feature_products = await query('UPDATE feature_products SET feature_products='+put_json_feature_product+' WHERE feature_id='+req.body.featureName);
    return res.send({success: true, server_message: update_feature_products});
  }
  else {
    var newArrayForFeatureProducts = [];
    for (var i = 0; i < req.body.PurchaseList.length; i++) {
      newArrayForFeatureProducts.push(req.body.PurchaseList[i]);
      console.log(newArrayForFeatureProducts);
    }
    var put_json_feature_product = "'"+JSON.stringify(newArrayForFeatureProducts)+"'";
    const insert_feature_products = await query('INSERT INTO feature_products (feature_id, feature_products) VALUES ('+req.body.featureName+', '+put_json_feature_product+')');
    return res.send({success: true, server_message: insert_feature_products});
  }
  // var insert_feature_products = '';
  // return res.send({success: true, server_message: insert_feature_products});
});


app.post('/api/saveSpecificationDetails',(req,res)=>{
  values = req.body.specification_details_name;
  // var valuesArray = values.split(" ");
  console.log('The Request : ', req.body.ProductSpecificationValuesArray);
  // return res.send({success: true});
  try {
    var insert_sql_query = "INSERT INTO product_specification_details (category_id, specification_details_name, status) VALUES ('"+req.body.categoryId+"', '"+JSON.stringify(req.body.ProductSpecificationValuesArray)+"', '1' )";
    dbConnection.query(insert_sql_query, function (err, result) {
      if (result) {
        console.log("1 record inserted to category");
        return res.send({success: true, server_message: result});
      }
      else {
        console.log('Error to inseret at category : ', err);
        return res.send({success: false, error: err});
      }
    });
  }
  catch (error) {
    if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
  }
});


app.listen(3002, () =>
console.log('Express server is running on localhost:3001')
);