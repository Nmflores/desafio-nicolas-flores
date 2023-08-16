import m_json from '../arquivos/cardapio.json' assert{type:'json'};
class CaixaDaLanchonete {

    calcularValorDaCompra(metodoDePagamento, itens) {
        let transf = " ";
        let soma  = 0;
        let temCafe = false;
        let temSanduiche = false;

        //let pedido = JSON.parse("\"pedido\":[{}]");


        //Loop usado para transformar o input duplo do array itens em um singular adicionando ao array respectivo
        if(itens.length == 0 ){
            console.log("erro");
            return "Não há itens no carrinho de compra!";            
        }
       
        for(let i = 0;i<itens.length;i++){
            transf = itens[i].split(',');
            if(transf[1].includes('0')){
                console.log("erro");
                return "Quantidade invalida!";
            }
        
            if(verificaCodigo(transf[0])){
                return "Item invalido!";
            }
           
            if(transf[0] == "café" ){
                temCafe = true;
            } else if(transf[0] == "sanduiche" ){
                temSanduiche = true;
            } else if(transf[0] == "chantily" && temCafe == false){
                console.log("erro");
                return "Item extra não pode ser pedido sem o principal";      
            } else if(transf[0] == "queijo" && temSanduiche == false){
                console.log("erro");
                return "Item extra não pode ser pedido sem o principal"; 
            }

            // Calcula o valor e adiciona 
            soma = soma + calculaItem(metodoDePagamento, transf[0], transf[1]);
            

        }
        let texto = soma.toFixed(2);
        let total = "R$" + texto;
        console.log(total);
           
        
    }
               
   

}

function calculaItem(metodo,codigo,quantidade){
    for(let i in m_json.cardapio){
       if(codigo == m_json.cardapio[i].codigo){
            let valor = parseFloat(m_json.cardapio[i].valor.replace(',','.')).toFixed(2);
            let transformador = Number(valor);
            let total = transformador * quantidade;
        
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
       
    
         
      
    


new CaixaDaLanchonete().calcularValorDaCompra('teste',['suco,1','sanduiche,2','café,1','salgado,3']);
export { CaixaDaLanchonete };
