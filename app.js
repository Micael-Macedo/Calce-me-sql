const { response } = require('express');
var express = require('express');
var {engine} = require('express-handlebars');
var bp = require('body-parser');
var mysql = require('mysql2');

var app = express();
var parcerias = [];

//configurações para se conectar ao banco de dados
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "1234",
    database: 'calce-me'
})

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(bp.urlencoded({extended: false}))
app.use(bp.json());

app.use(express.static('public'))

app.get('/',function(request, response){
    // sql é uma string, porém ela contém um script do banco para ser executado através da conexão
    sql = 'SELECT * FROM calcados'
    mysqlConnection.query(sql, function(err, resultSet, fields){
        if(err){
            console.log(err)
        }else{
            response.render('index', {calcados:resultSet});
        }
    })
});
app.get('/cadastro', function(request, response){
    response.render('cadastro');
});
app.get('/parcerias', function(request, response){
    sql = 'SELECT * FROM parcerias'
    mysqlConnection.query(sql, function(err, resultSet, fields){
        if(err){
            console.log(err)
        }else{
            response.render('parcerias', {parcerias:resultSet});
        }
    })
});
app.get('/cadastroparceria', function(request, response){
    response.render('cadastroparceria');
});
app.get('/fabricacao', function(request, response){
    response.render('fabricacao');
});

app.post('/cadastroparceria', function(request, response){
    nome = request.body.nome;
    anos = request.body.anos;
    contato = request.body.contato;

    values = [[nome, anos, contato]];
    if(request.body.anos >= 1){
        sql = 'INSERT INTO parcerias (nome, anos, contato) VALUES ?';
        mysqlConnection.query(sql, [values], function(err, results){
            if(err) throw err;
                console.log(results.affectRows);
        }) 
    }
    response.redirect('/parcerias');
})
app.post('/cadastro', function(request, response){
    modelo = request.body.txtModelo 
    cor = request.body.txtCor
    descricao = request.body.txtDescricao
    material = request.body.txtMaterial
    valor = request.body.numValor
    
    values = [[modelo, cor, descricao, material, valor]];
    sql = 'INSERT INTO calcados (modelo, cor , descricao, material, valor) VALUES ?';
    mysqlConnection.query(sql, [values], function(err, results){
        if(err) throw err;
            console.log(results.affectRows);
    })
    response.redirect('/');
})

app.listen(3000);