//instanciando as variaveis de uso
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const porta = 54000;
const sql = require('mssql');
const conexaoStr = "Server=localhost;Database=WebSiteHoteis;User Id=Admin;Password=20092001; ";

// abre a conexao
sql.connect(conexaoStr)
.then(conexao => global.conexao = conexao)
.catch(erro => console.log(erro));

// configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
// permite acesso do javascript no servidor local do node

/*
        ESQUEMA DE CONVERSA SERVIDOR -- NODE -- LOCALHOST -- JAVASCRIPT

        NODE ----> Servidor local [localhost:54000] ----> 'posta o json'  
        
        [COM A FUNÇÃO ABAIXO]
        
        ---- >acesso do JSON para o Javascript

*/ 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PATCH, DELETE");
    next();
    });

//definindo as rotas
const rota = express.Router();
// OQUE O USUARIO VAI ENCONTRAR EM 'localhost:54000/'
rota.get('/', (requisicao, resposta) => resposta.json({ mensagem: 'Funcionando!'}));
app.use('/', rota);

/*LISTANDO DADOS*/ 

function execSQL(sql, resposta) {
    global.conexao.request()
    .query(sql)
    .then(resultado => resposta.json(resultado.recordset))
    .catch(erro => resposta.json(erro));
    }
    
    
    // DEFINE O QUE VAI SER MOSTRADO NA 'localhost:54000/clientes'
    rota.get('/hoteis', (requisicao, resposta) =>{
    execSQL('SELECT * FROM WHotel', resposta);
    })

    //o simbolo ? indica que id na rota abaixo é opcional
    rota.get('/hoteis/:id?', (requisicao, resposta) => {
    let filtro = '';
    if (requisicao.params.id)
        filtro = ' where HotelID=' + parseInt(requisicao.params.id);
    execSQL('SELECT * from WHotel' + filtro, resposta);
    })


//explicitando a porta da api
app.listen(porta);
console.log('API Funcionando!');