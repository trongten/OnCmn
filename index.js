const express = require('express')
const app = express()
const multer = require('multer')
const upload = multer()

/// Install EJS
app.use(express.static('views'))
app.set('view engine','ejs')
app.set('views', './views')

//AWS
const AWS = require('aws-sdk')
AWS.config = new AWS.Config({
    accessKeyId:'AKIA3L2RGXXEICA3D4KL',
    secretAccessKey:'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',
    region:'ap-southeast-1'
})
const docClient =new AWS.DynamoDB.DocumentClient()
const tableName = 'baocaoon'


/// Trang chu -> ds bao cao
app.get('/',(req,res)=>{
    docClient.scan({
        TableName:tableName
    },(err,data)=>{
        if(err){
            res.send(err);
        }else{
            res.render('index',{data:data.Items})
        }
       
    })
})

//Chuyen trang ADD
app.get('/create',(req,res)=>{
    res.render('create')
})


//Add 1 bao cao vao AWS roi load lai
app.post('/create',upload.fields([]),(req,res)=>{
    docClient.put({
        TableName:tableName,
        Item:{
            "ma":req.body.ma,
            "ten":req.body.ten,
            "tacgia":req.body.tacgia,
            "isbn":req.body.isbn,
            "sotrang":req.body.sotrang,
            "nam":req.body.nam,
        }
    },(err,data)=>{
            if(err) {
                res.send(err);
            }else{
                res.redirect('/')
            }
    })
})


//Xoa 1 bao cao
app.post('/delete',upload.fields([]),(req,res)=>{
    docClient.delete({
        TableName:tableName,
        Key:{
            'ma':req.body.del
        }
    },(err,data)=>{
        if(err){
            res.send(err)
        }else{
            res.redirect('/')
        }
    })

})

app.post('/update', upload.fields([]),(req, res)=>{
    docClient.query({
        TableName:tableName,
        KeyConditionExpression:'#ma=:ma',
        ExpressionAttributeNames:{
            '#ma': 'ma'
        },
        ExpressionAttributeValues:{
            ':ma': req.body.up
        }
    },(err,data)=>{
            if(err) {
                res.send(err)
            }else{
                res.render('update',{data:data.Items[0]})
            }
    })
}
)

//listten port 3000
app.listen(3000,()=>{
    console.log('listening on http://localhost:3000');
})