// Fonction 0 d'initialisation:
//  Identification de la collection de table de class 'md-sortable'
console.log('mySortTable.js - en cours de chargement...');
var mdTableClass="md-sortable";
/*
*   Classe Principale pour l'initialisation d'un tri
*/
function Function0(a,b,c,d,e) {
    if (a) {
        this.a=a;
    } else {
        this.a= 'glyphicon glyphicon-sort-by-alphabet';
    }
    if (b) {
        this.b=b;
    } else {
        this.b= 'glyphicon glyphicon-sort-by-alphabet-alt';
    }
    if (c) {
        this.c=c;
    } else {
        this.c= 'glyphicon glyphicon-sort';
    }
    if (d) {
        this.d=d;
    } else {
        this.d= 'glyphicon glyphicon-sort-by-order';
    }
    if (e) {
        this.e=e;
    } else {
        this.e= 'glyphicon glyphicon-sort-by-order-alt';
    }
    this.tables=[];
    this.headers= new Array();
    this.lines= new Array();
    this.types= new Array();
    this.className='md-sortable';
};
/*
*   Stocke dans tables la collections des tables triables
*/
Function0.prototype.getTables = function() {
    this.tables = $('.'+this.className).get();
    console.log("-->mySortTable a trouvé "+this.tables.length+" table à rendre triable dans la page.");
};

/*
*   Stocke dans this.headers les collections de th de chaque table
*   this.header[0] renvoie la collections des th de la table 0
*/
Function0.prototype.getHeaders = function() {
    console.log("-->récupération des headers");
    for (var i=0; i<this.tables.length; i++) {
        ths=this.tables[i].getElementsByTagName("th");
        this.headers[i]=ths;
        //$(this.headers[i]).css("border","1px yellow solid");
    }
}
/*
*   Stocke dans this.lines les collection de tr de chaque table
*   this.lines[0] renvoie la collection des tr contenant des td
*/
Function0.prototype.getLines = function() {
    console.log("-->récupération des lines du tableau");
    for (var i=0; i<this.tables.length; i++) {//Parcours des tableaux => i
        var bodies=this.tables[i].getElementsByTagName("tbody");
        for (var j=0; j<bodies.length; j++) {// Parcours des body => j
            var n_ligne=0; //normalement il n'y a qu'un seule tbody par tableau...
            //Extraction de l'ensemble des lignes 'tr'
            var lignes=bodies[j].getElementsByTagName("tr");
            var trs= new Array(); //Pour mémoriser les lignes
            for (var k=0; k<lignes.length; k++) {// Parcours des lignes =>k
                //Extraction des cellules 'td'
                if (lignes[k].getElementsByTagName('td').length>0) { // Si la ligne contient des cellules
                    // On ajoute la ligne à la collection
                    trs[n_ligne]=lignes[k];
                    n_ligne++;
                }
            }
            this.lines[i]=trs;
        }
    }
}

/* 
*   iDate(strDate) renvoie 'true' si strDate est convertible en date 
*   au format JJ/MM/AAAA ou JJ.MM.AAAA ou JJ-MM-AAAA
*/
var isDate= function (strDate) {
    var myRegExpDate = /^\d{2}([./-])\d{2}\1\d{4}$/;
    return myRegExpDate.test(strDate);
}

/* 
*   iNumber(strNombre) renvoie 'true' si strNombre est convertible en nombre
*   au format n+ ou n+.n* ou n+,n* 
*/
var isNumber = function (strNombre) {
    //Un nombre contient 0 ou 1 "." ou ","
    //il ne contient également que des chiffres
    var myRegExpNombre = /^\d+[.,]{0,1}\d*$/;
    return myRegExpNombre.test(strNombre);
}

/*
*   Stocke dans this.types la collection de type de données de chaque table
*   this.types[0] renvoie le tableau des types des données par colonne
*/
Function0.prototype.getTypes = function() {
    // Pour déterminer le type de données contenu d'une colonne, nous parcourons toutes les cellules de la colonne
    // On teste si les cellules sont des dates
    // Sinon on teste si les cellules sont des nombres
    // Sinon les éléments sont considérés comme des chaines textes

    for (var i=0; i<this.lines.length; i++) {//Parcours des tableaux => i
        var dataType = new Array();
        console.log("-->analyse des types de données du tableau n°"+i);
        for (var j=0; j<this.lines[i].length; j++) { // lignes => j
            // Pour chaque ligne tr on récupère les cellules td
            tds=this.lines[i][j].getElementsByTagName('td');
            for (var k=0; k<tds.length; k++) { // Cellules => k
                cellStr=tds[k].innerText||tds[k].textContent;
                if (isDate(cellStr)) {
                    //console.log("c'est une date");
                    if (typeof dataType[k]==='undefined') {
                        // C'est la 1ère fois qu'on parcours le tableau
                        dataType[k]="date";
                        $(this.headers[i][k]).attr('type','date');
                        // ajout de l'attribut type dans td
                    } else if (dataType[k]!="date") {
                        // Ce n'est pas la 1ère ligne & on trouve un type différent
                        console.log("La colonne "+k+" du tableau n°"+i+" ne contient pas des données d'un type unique");
                    }
                    
                } else if (isNumber(cellStr)) {
                    if (typeof dataType[k]==='undefined') { 
                        dataType[k]="nombre";
                        $(this.headers[i][k]).attr('type','nombre');
                    } else if (dataType[k]!='nombre') {
                        console.log("La colonne "+k+" du tableau n°"+i+" ne contient pas des données d'un type unique");
                    }
                     
                } else {
                    if (typeof dataType[k]==='undefined') {
                        dataType[k]="texte";
                        $(this.headers[i][k]).attr('type','texte');
                    } else if (dataType[k]!='texte') {
                        console.log("La colonne "+k+" du tableau n°"+i+" ne contient pas des données d'un type unique");
                    }
                }
                
            }
        }
        this.types[i]=dataType;
        console.log(this.types[i]);
    }
}


/*
*   Réinitialise les glyphicones des colonnes ne contenant pas currentSpan
*   Et renvoie l'indice du tableau contenant currentSpan
*/
Function0.prototype.resetOtherSpan= function(currentSpan) {
    // on parcourt les headers et pour chaque span différent de currentSpan on remet le glyphicon à f0.c
    // 1.détermination de l'indice du tableau considéré
    // 2.parcours des headers de ce tableau
    // 3.extration et comparaison du span du header avec currentSpan
    // 4.Si identique, on ne fait rien, sinon on redéfinit la classe du span à f0.c
    var indice=-1;
    var colonne=-1;
    for (var i=0; i<this.headers.length;i++) { //-> Tableau
        for (var j=0; j<this.headers[i].length; j++) {
            if (this.headers[i][j]===currentSpan.parentElement) {
                indice=i;
                colonne=j;
                break;
            }
        }
        if (indice!=-1) { 
            break;
        }
    }
    for (var i=0; i<this.headers[indice].length; i++) {
        var span = this.headers[indice][i].getElementsByTagName('span')[0];
        if (span!=currentSpan) {
            span.className=f0.c;
        }
    }
    return { index_T: indice,
             index_c: colonne};
}

/*  
*   getDate(strDate) convertit strDate en date 
*   (suppose que isDate ait été exécutée avant)
*/
var getDate = function (strDate){
    var myRegExpDate = /(\d{2})[./-](\d{2})[./-](\d{4})/;//jj-mm-aaaa
    myRegExpDate.exec(strDate);
    day=Number(RegExp.$1);
    month=Number(RegExp.$2);
    year=Number(RegExp.$3);
    d = new Date(year,month, day);
    return d;  
	  }

// fonction de tri croissant
var myArraySort=function(a,b) {
 if (isDate(a[0])&&(isDate(b[0])))  {
     diff = getDate(a[0]).getTime()-getDate(b[0]).getTime();
     return (diff==0?diff:diff/Math.abs(diff));
 } else if (isNumber(a[0])&&isNumber(b[0])) {
     var a_num=Number(a[0].replace(",","."));
     var b_num=Number(b[0].replace(",","."));
     if (a_num<b_num) {
         return -1;
     } else if (b_num<a_num) {
         return 1;
     } else { return 0;}
 } else {
     //  é,è,ê,ë => remplacés par la lettre e pour le tri
     var a_string = a[0].replace(/[éèêë]/,"e");
     var b_string = b[0].replace(/[éèêë]/,"e");
     // à, â, ä => remplacés par la lettre a pour le tri
     a_string=a_string.replace(/[àâä]/,"a");
     b_string=b_string.replace(/[àâä]/,"a");
     // ù, û, ü => remplacés par la lettre u pour le tri
     a_string=a_string.replace(/[ùûü]/,"u");
     b_string=b_string.replace(/[ùûü]/,"u");
     // î, ï => remplacés par la lettre i pour le tri
     a_string=a_string.replace(/[îï]/,"i");
     b_string=b_string.replace(/[îï]/,"i");
     // ô, ö => remplacés par la lettre o pour le tri
     a_string=a_string.replace(/[ôö]/,"o");
     b_string=b_string.replace(/[ôö]/,"o");
     
     console.log('a: '+a[0]+'->'+a_string);
     console.log('b: '+b[0]+'->'+b_string);
      if (a_string<b_string) {
          return -1;
      }  else if (b_string<a_string) {
          return 1;
      } else { return 0;}
  }
};

/*
*   Ajoute les balises span de glyhicon dans chacun des titres des tableaux
*
*/
Function0.prototype.setGlyphicons = function() {
    console.log("-->mise en place des glyphicones & gestionnaires de clic");
    /*
    *   Définition de la fonction a exécuter lors d'un clic sur un glyphicone-sort
    */
    function filterOnClick(e) {
        mySpan=e.target;
        var indices = f0.resetOtherSpan(mySpan);
        
        // création du tableau à trier
        var theTable= new Array();
        // la 1ère colonne de ce tableau contiendra la valeur de la colonne à trier
        // la 2ième colonne de ce tableau contiendra la ligne elle-même <tr>
        for (var i=0; i<f0.lines[indices.index_T].length; i++) {
            var valueC = f0.lines[indices.index_T][i].getElementsByTagName("td")[indices.index_c].textContent;
            theTable.push([valueC,f0.lines[indices.index_T][i]]);
        }
        // A ce stade, la commande 
        //      theTable.sort(myArraySort); 
        // trierait le tableau de façon croissante
        // Et l'ajout ensuite de la commande 
        //      theTable.reverse();
        // trierait finalement le tableau de façon décroissante
        theTable.sort(myArraySort);
        var classSpan = mySpan.className;
        switch (classSpan) { // c -> (a ou d) -> (b ou e) -> c
            case f0.a:
                // on supprime la classe f0.a et on ajoute la classe f0.b
                $(mySpan).removeClass(f0.a).addClass(f0.b);
                theTable.reverse();
                break;
            case f0.b:
                // on supprime la classe f0.b et on ajoute la classe f0.c
                $(mySpan).removeClass(f0.b).addClass(f0.c);
                break;
            case f0.c:
                if ($(mySpan.parentNode).attr('type')=='texte') {
                    $(mySpan).removeClass(f0.c).addClass(f0.a);
                } else {
                    $(mySpan).removeClass(f0.c).addClass(f0.d);
                }
                break;
            case f0.d:
                // on supprime la classe f0.d et on ajoute la classe f0.e
                $(mySpan).removeClass(f0.d).addClass(f0.e);
                theTable.reverse();
                break;
            case f0.e:
                // on supprime la classe f0.e et on ajoute la classe f0.c
                $(mySpan).removeClass(f0.e).addClass(f0.c);
                break;
            default:
                console.log('defaut');
        }
        //console.log("!---> Tableau trié ");
        //console.log(theTable);
        //Maintenant il est temps de modifier le DOM comme il convient ! :)
        var tbody=f0.tables[indices.index_T].getElementsByTagName('tbody')[0];
        trs=tbody.getElementsByTagName("tr");
        for (var i=0; i<trs.length; i++) {
            $(trs[i]).remove();
        }
        for (var i=0; i<theTable.length; i++) {
            $(tbody).append(theTable[i][1]);
        }    
    }
    for (var i=0; i<this.headers.length; i++) { //parcours des tableaux => i
        var ths=this.headers[i];
        for (var j=0; j<ths.length; j++) { // parcours des th du tableau
            $(ths[j]).append(' <span class="'+this.c+'"></span>');
            mySpan=ths[j].getElementsByTagName('span');
            // Affectation de la fonction filterOnClick à l'évènement clic des spans du tableau
            mySpan[0].addEventListener('click',filterOnClick,false);
        }
    }
}

Function0.prototype.init = function(className){
    if (className) {
        this.className=className;
    }
    this.getTables();
    this.getHeaders();
    this.getLines();
    this.getTypes();
    this.setGlyphicons();
}





var f0 = new Function0();
var tables = f0.init(mdTableClass);

console.log('mySortTable.js - Chargé !');