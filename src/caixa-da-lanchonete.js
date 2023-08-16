import m_json from '../arquivos/cardapio.json' assert{type:'json'};
import metodoPagamento from '../arquivos/tipoPagamentos.json' assert{type:'json'};

class CaixaDaLanchonete {

    calcularValorDaCompra(metodoDePagamento, itens) {
        let transf = null;
        let soma  = 0;
        let temCafe = false;
        let temSanduiche = false;

        //Se itens estiver vazio retorna a mensagem
        if(itens.length == 0 ){
            console.log("Não há itens no carrinho de compra!");
            return "Não há itens no carrinho de compra!";            
        }
        //Se o metodo de pagamento não existe no arquivo json retorna a mensagem
        if(verificaMetodo(metodoDePagamento)){
            console.log("Forma de pagamento inválida!");
            return "Forma de pagamento inválida!";
        }
     //O loop está sendo usado para separar os valores de itens,colocando os codigos dos produtos em transf[0] e a quantidade em transf[1]
        for(let i = 0;i<itens.length;i++){
            transf = itens[i].split(',');
            if(!transf){
                console.log("erro");
                return "Item invalido!";
            }
            //Se quantidade for vazia retorna quantidade invalida
            if(transf[1].includes('0')){
                console.log("Quantidade invalida!");
                return "Quantidade invalida!";
            }
            //Verifica se o codigo existe no arquivo json
            if(verificaCodigo(transf[0])){
                console.log("Item invalido!");
                return "Item invalido!";
            }
           //Se codigo for cafe o chantily pode ser adicionado e se for sanduiche o queijo pode ser adicionado
            if(transf[0] == "cafe" ){
                temCafe = true;
            } else if(transf[0] == "sanduiche" ){
                temSanduiche = true;
            } else if(transf[0] == "chantily" && temCafe == false){
                console.log("Item extra não pode ser pedido sem o principal");
                return "Item extra não pode ser pedido sem o principal";      
            } else if(transf[0] == "queijo" && temSanduiche == false){
                console.log("Item extra não pode ser pedido sem o principal");
                return "Item extra não pode ser pedido sem o principal"; 
            }

            // Calcula o valor e adiciona 
            soma = soma + calculaItem(metodoDePagamento, transf[0], transf[1]);

        }

        let texto = soma.toFixed(2);
        let total = "R$ " + texto.replace('.',',');
        console.log(total);
        
        return total;
           
        
    }
               
   

}

function calculaItem(metodo,codigo,quantidade){
    let modificacao = 0;
    //Vasculha o arquivo json para descobri a modificação que será feita no total
    for(let i in metodoPagamento.tipos){
        if(metodo == metodoPagamento.tipos[i].nome){
            modificacao = metodoPagamento.tipos[i].modificacao;
            
        }
    }
    //Vasculha o arquivo json para achar o codigo
    for(let i in m_json.cardapio){
        if(codigo == m_json.cardapio[i].codigo){
            let valor = parseFloat(m_json.cardapio[i].valor.replace(',','.')).toFixed(2);
            let transformador = Number(valor);
            let total = 0;
            if(metodo == 'dinheiro'){
                let desconto = transformador * (modificacao/100);
                total = (transformador - desconto) * quantidade;
                return total;
            }

            if(metodo == 'credito'){
                let acrescimo = transformador * (modificacao/100);
                total = (transformador + acrescimo) * quantidade;
                return total;
            }

            total = transformador * quantidade
           
        
            return total;
            
       }
    }


        
}

function verificaCodigo(codigo){
    for(let i in m_json.cardapio){
        if(codigo == m_json.cardapio[i].codigo){
            return false;
        }
    }
    return true;
}

function verificaMetodo(metodo){
    for(let i in metodoPagamento.tipos){
        if(metodo == metodoPagamento.tipos[i].nome){
            return false
        }

    }
    return true;
} 
    
         
//Meu npm test não conseguiu iniciar, mesmo depois de eu seguir as instruções e seguir o link do babel, por isso eu vou adicionar cada teste      
    
//Teste de carrinho vazio
new CaixaDaLanchonete().calcularValorDaCompra('credito',[]);
new CaixaDaLanchonete().calcularValorDaCompra('debito',[]);
new CaixaDaLanchonete().calcularValorDaCompra('dinhheiro',[]);
//Teste com 1 café
new CaixaDaLanchonete().calcularValorDaCompra('credito',['cafe,1']);
new CaixaDaLanchonete().calcularValorDaCompra('debito',['cafe,1']);
new CaixaDaLanchonete().calcularValorDaCompra('dinheiro',['cafe,1']);
//Teste com 1 café,1 sanduiche e 1 queijo
new CaixaDaLanchonete().calcularValorDaCompra('credito',['cafe,1','sanduiche,1','queijo,1']);
new CaixaDaLanchonete().calcularValorDaCompra('debito',['cafe,1','sanduiche,1','queijo,1']);
new CaixaDaLanchonete().calcularValorDaCompra('dinheiro',['cafe,1','sanduiche,1','queijo,1']);
//Teste 4 cafés,3 sanduiches e 2 queijos
new CaixaDaLanchonete().calcularValorDaCompra('credito',['cafe,4','sanduiche,3','queijo,2']);
new CaixaDaLanchonete().calcularValorDaCompra('debito',['cafe,4','sanduiche,3','queijo,2']);
new CaixaDaLanchonete().calcularValorDaCompra('dinheiro',['cafe,4','sanduiche,3','queijo,2']);
//Teste de erros
new CaixaDaLanchonete().calcularValorDaCompra('dinheiro',['cafe,0']);
//new CaixaDaLanchonete().calcularValorDaCompra('dinheiro',['1']);
new CaixaDaLanchonete().calcularValorDaCompra('dinheiro',['pizza,1']);
new CaixaDaLanchonete().calcularValorDaCompra('especie',['cafe,1']);
//Teste de acompanhamentos
new CaixaDaLanchonete().calcularValorDaCompra('dinheiro',['chantily,1']);
new CaixaDaLanchonete().calcularValorDaCompra('credito',['queijo,1']);
new CaixaDaLanchonete().calcularValorDaCompra('credito',['chantily,1','sanduiche,1']);
new CaixaDaLanchonete().calcularValorDaCompra('credito',['cafe,1','queijo,1']);

export { CaixaDaLanchonete }
