function extraiProximaLinha(posicaoAtual, arquivoOrigem) {
  var linha = "";
  for(var i=posicaoAtual; i < arquivoOrigem.length; i++) {
    if(arquivoOrigem[i] == "\n") { 
      return [i, linha]
    }
    else {
      linha = linha + arquivoOrigem[i];
    }
  }
  return [i, linha]
}

let ul = document.getElementById("items");
let items = document.getElementsByTagName("li");

function criarElemento(input){
  let li = document.createElement("li");
  let text = document.createTextNode(input);
  li.appendChild(text);
  ul.appendChild(li);
}

document.getElementById('fileInput').addEventListener('change', function selectedFileChanged() {
  if (this.files.length === 0) {
    console.log('No file selected.');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function fileReadCompleted() { 
    let retorno = [-1,""];
    let linha = "";
    do {
      retorno = extraiProximaLinha(retorno[0]+1, reader.result);
      linha = retorno[1].replace("<NOBR>", "").replace("</NOBR>", "")//.replace("&nbsp;", "")
      //criarElemento(linha); 
      //criarElemento(/(<TR>)/.test(linha))

      if (/(<TR>)/.test(linha)) {
        var transacao = "";
        var memo = false; 
        while (true) {
          retorno = extraiProximaLinha(retorno[0]+1, reader.result);
          linha = retorno[1].replace("<NOBR>", "").replace("</NOBR>", "")//.replace("&nbsp;", "")
          //criarElemento(linha)
          if (/(<\/TR>)/.test(linha))
            break;
          else {
              if (/>&nbsp;<\/P/.test(linha)){
                
              } 
              else if (/>([0-3][0-9]\/[0-1][0-9])/.test(linha)) {
                transacao = transacao + />([0-3][0-9]\/[0-1][0-9])/.exec(linha)[0].substr(1) 
                if (!memo) transacao = transacao + " | "
                memo = false
              }
              else if (/(- )?(\d+\.)?\d+(\,\d{1,2})/.test(linha)) {
                transacao = transacao + " | " + /(- )?(\d+\.)?\d+(\,\d{1,2})/.exec(linha)[0];
                memo = false
              }    
              else if (/(<P.*>)(.*)(<\/P>)/.test(linha)) {
                transacao = transacao + linha.match('<P.*>' + "(.*)" + '</P>')[1];  + " | "
                memo = true;
              } 
              else
                memo = false;
          }
        } ;
        //criarElemento(transacao)
        if (/^([0-3][0-9]\/[0-1][0-9] \|)/.test(transacao)) criarElemento(transacao);
      }
 
      
    } while (retorno[0] < reader.result.length);  
  };
  reader.readAsText(this.files[0]);
});
    
/*    
    var linha;
    let linhaTD = true
    let linhaP = true
    let loopTR = false
    let tipoLinha = "OUTRA"
    var parteTransacao = "";
    var transacao = "";
    var memo = false;    
    do {
      retorno = extraiProximaLinha(retorno[0]+1, reader.result);
      linha = retorno[1].replace("<NOBR>", "").replace("</NOBR>", "").replace("&nbsp;", "")
     
      if (/(<P.*>)(.*)(<\/P>)/.test(linha)) {linhaTD = true} else linhaTD = false; 
      if (/(<TD)(.*)(TD>)/.test(linha)) {linhaP = true} else linhaP = false;
      if (/(<TR>)/.test(linha)) {loopTR = true };
      if (/(<\/TR>)/.test(linha)) {loopTR = false };

      criarElemento(linha); 
      criarElemento(loopTR + " " + linhaP + " " + linhaTD);
      criarElemento(/>([0-3][0-9]\/[0-1][0-9])/.test(linha)); 
      criarElemento(/(- )?(\d+\.)?\d+(\,\d{1,2})/.test(linha));
      criarElemento(/(<P.*>)(.*)(<\/P>)/.test(linha))
      
      if (!loopTR) { 
        if (/^([0-3][0-9]\/[0-1][0-9] \|)/.test(transacao)) {
          console.log(transacao);
          criarElemento(transacao);
        }
        transacao = "";
        memo = false;
      }
       
      if (/>([0-3][0-9]\/[0-1][0-9])/.test(linha)) {
        transacao = transacao + />([0-3][0-9]\/[0-1][0-9])/.exec(linha)[0].substr(1) 
        if (!memo) transacao = transacao + " | "
        memo = false
      }
      else if (/(- )?(\d+\.)?\d+(\,\d{1,2})/.test(linha)) {
        transacao = transacao + " | " + /(- )?(\d+\.)?\d+(\,\d{1,2})/.exec(linha)[0];
        memo = false
      }    
      else if (/(<P.*>)(.*)(<\/P>)/.test(linha)) {
        transacao = transacao + linha.match('<P.*>' + "(.*)" + '</P>')[1];  + " | "
        memo = true;
      } 
      
    } while (retorno[0] < reader.result.length);  
  };
  reader.readAsText(this.files[0]);
});

*/
   






