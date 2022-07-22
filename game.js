class Palavras {
    constructor(tamanho, frases = [], palavras = [], motherId) {
        this.tamanho = tamanho;
        this.palavra = palavras;
        this.frase = frases;
        this.root = document.getElementById(motherId);
        this.child1 = document.createElement("div");
        this.child1.id = "child1";
        this.child2 = document.createElement("div");
        this.child2.id = "child2";
        this.letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.grid = [];
        this.posicaoPalavra = [];
        this.idx = 0;
    }

    get getTamanho() {
        return this.tamanho;
    }

    get getPalavra() {
        return this.palavra;
    }

    /**
     * @param {any} tamanho
     */
    set setTamanho(tamanho) {
        this.tamanho = tamanho;
    }

    /**
     * @param {any} palavra
     */
    set setPalavra(palavra) {
        this.palavra = palavra;
    }

    randomNat(max) {
        return Math.floor(Math.random() * max) + 1;
    }

    randomLetra() {
        return this.letras.charAt(Math.floor(Math.random() * this.letras.length));
    }

    geraGrid() {
        for (let y = 0; y < this.tamanho; y++) {
            this.grid.push([]);
            let gridRow = document.createElement("div");
            gridRow.className = "grid-row";
            this.child1.appendChild(gridRow);
            for (let x = 0; x < this.tamanho; x++) {
                let gridCell = document.createElement("div");
                gridCell.innerHTML = this.randomLetra();
                gridCell.className = "grid-cell";
                gridCell.style.width = `${3.8}vh`;
                gridCell.style.height = `${3.8}vh`;
                gridRow.appendChild(gridCell);
                this.grid[y].push(gridCell);
            }
        }
    }

    formataPalavra(palavra) {
        return "_".padStart(palavra.length + (palavra.length - 1), "_ ");
    }

    inserePalavra(index, modo) {
        const HORIZONTAL = 1;
        const VERTICAL = 2;
        const DIAGONAL = 3;
        let sum_x = 0;
        let sum_y = 0;
        let x = (Math.floor(Math.random() * (modo == HORIZONTAL || modo == DIAGONAL ? this.grid[0].length - this.palavra[index].length + 1 : this.grid.length - this.palavra[index].length + 1)));
        let y = (Math.floor(Math.random() * (modo == VERTICAL || modo == DIAGONAL ? this.grid.length - this.palavra[index].length + 1 : this.grid[0].length - this.palavra[index].length + 1)));
        for (let i = 0; i < this.palavra[index].length; i++) {
            sum_x = modo == HORIZONTAL || modo == DIAGONAL ? i : 0;
            sum_y = modo == VERTICAL || modo == DIAGONAL ? i : 0;
            this.grid[sum_y + y][sum_x + x].innerHTML = this.palavra[index][i];
            this.posicaoPalavra.push([sum_x + x, sum_y + y]);
        }
    }

    insereFrase(index) {
        this.child2.innerHTML = this.frase[index].replace(this.palavra[index], this.formataPalavra(this.palavra[index]))
    }

    addClick() {
        this.grid.forEach((y, idx_y) => {
            y.forEach((x, idx_x) => {
                x.onclick = () => {
                    this.posicaoPalavra.forEach((el, index) => {
                        if (el[0] == idx_x && el[1] == idx_y) {
                            x.style.backgroundColor = "green";
                            x.style.borderRadius = "0";
                            x.style.boxShadow = "1px 1px 2px black";
                            x.style.color = "white";
                            this.posicaoPalavra.splice(index, 1);
                            if (this.posicaoPalavra.length == 0 && this.idx + 1 != this.palavra.length) {
                                this.start(this.idx + 1);
                            } else if (this.posicaoPalavra.length == 0 && this.idx + 1 == this.palavra.length) {
                                document.getElementById("tempo").innerHTML = "";
                                this.root.innerHTML = "<div id='final'><b>VOCÊ VENCEU!</b><br> Você conseguiu salvar Homer da prisão por sonegação de impostos e pode receber seu prêmio clicando <button id='venceu' onclick='document.location.href = \"https://open.spotify.com/playlist/2C0cShMv03xyAXqhu2aaOp?si=2708df87468548b7\"'>aqui</button></div>"
                            }
                        } else if (x.style.backgroundColor != "green") {
                            x.style.backgroundColor = "red";
                        }
                    });
                }
            });
        });
    }

    start(index = 0) {
        this.idx = index;
        this.root.innerHTML = "";
        this.child1.innerHTML = "";
        this.child2.innerHTML = "";
        this.grid = [];
        this.root.appendChild(this.child1);
        this.root.appendChild(this.child2);
        this.geraGrid();
        this.inserePalavra(index, this.randomNat(3));
        this.insereFrase(index);
        this.addClick();
    }

}

var segundos = 0;
var inicio = false;
var limite = 20;
var cronos;

function counter_to_0() {
    let seg = segundos % 60;
    let min = Math.floor(segundos / 60);
    try {
        document.getElementById("timer").innerHTML = `${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`
    } catch (TypeError) {
        clearInterval(cronos);
    }
    if (segundos == 0) {
        police = document.getElementById("toon-police");
        homer = document.getElementById("toon-homer");
        police.style.transform = "translateX(0%)";
        document.getElementById("mae").innerHTML = "<div id='final'><b>VOCÊ PERDEU!</b><br> Não foi desta vez que você conseguiu salvar o Homer, porém, pode tentar novamente clicando <button id='perdeu' onclick='document.location.reload()'>aqui</button></div>"
        clearInterval(cronos);
    }
    segundos--;
}

function counter_to_x() {
    let seg = segundos % 60;
    let min = Math.floor(segundos / 60);
    document.getElementById("timer").innerHTML = `${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`
    segundos++;
    if (segundos == limite) {
        segundos = 3 * 60;
        clearInterval(espera);
        cronos = setInterval(counter_to_0, 1000);
        let timer = document.getElementById("timer");
        document.getElementById("mae").style.opacity = "1";
        timer.innerHTML = "";
        timer.style.opacity = "1";
        palavra.start();

    }
}

document.getElementById("mae").style.opacity = "0";
document.getElementById("timer").style.opacity = "0";
var espera = setInterval(counter_to_x, 1000);
let frases = [
    "The Beatles é bom, entretanto, Pink Floyd é melhor",
    "Eu lhe disse, naquela noite, que lhe odiava... Todavia, meu amor, perdido estava em meio a paixão.",
    "Diria-lhe que és o Sol e eu a Lua, contudo, Marta, eu não morreria todas as noites por você.",
    "Beijou a testa do filho, lhe deu boa noite, porem o observou por alguns segundos, o coração de mãe apertado em vê-lo doente.",
    "Homer gritou com todo seu ar: \"Amo-te mais do que a lua pode te amar\", mas a verdade Berto sabia, a Lua sempre amaria o Sol.",
    "Maria disse para seu namorado, num fio de voz: \"Se meu pai te pega cá, te mata\", mas seu namorado respondeu: \"que me pegue e me jogue aos porcos, entretanto, ainda a amarei\"",
    "Olhou o corpo do amado coberto de sangue e fechou os olhos, o estômago revirou, todavia, sabia, agora não haveria volta. Era viver ou morrer, porém ele sentia que agora menos ainda vivia.",
    "Palavras eram impossíveis para ele, sabia disso, contudo, rezava para que seus atos queimassem sob a pele de seu amante, gravando ali que um dia existiu, pois precisava lembrar a si mesmo que não era somente uma alma pecadora, condenada a nada mais que o inferno. Naoobstante, desejava que sua alma não corrompesse a pura amada, mas apenas ensinasse-a a se amar.",
    "Ele diria que o que eu fiz foi loucura, contudo,  como ele entenderia quão longe uma mãe iria pelo filho? Ele não sabe, não sabe, porém, no dia que se torne pai, espero que seu coração aguente as horas acordado toda vez que a noite cai e está sozinho em casa.",
    "Marta ainda espera por ele, ainda se senta na cadeira de balanço e espera, mas ela sabe que ele não irá voltar. Na guerra os homens caem, mas sobre seus corpos erguem-se prédios para sustentarem outros homens. Ela só espera que o corpo de seu marido sustente um belo prédio.",
    "Naoobstante suas declarações de amor chegavam as orelhas de sua amada, logo ela deixou de amá-lo e trocou-o por um jogador de futebol flamenguista, quem a julgaria? Até ele se deixaria pelo jogador."
].map(function(x) { return x.toUpperCase() });
let respostas = [
    "entretanto",
    "todavia",
    "contudo",
    "porem",
    "mas",
    "entretanto",
    "todavia",
    "naoobstante",
    "contudo",
    "mas",
    "naoobstante"
].map(function(x) { return x.toUpperCase() });
var palavra = new Palavras(15, frases, respostas, "mae");