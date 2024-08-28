"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readlineSync = require("readline-sync");
var Conta = /** @class */ (function () {
    function Conta(nomeUsuario, senha, informacaoAdicional) {
        this.id = Conta.idsUtilizados.length + 1; // gera um novo ID com base no tamanho do array de IDs utilizados
        Conta.idsUtilizados.push(this.id); // adiciona o ID ao array de IDs utilizados
        this.nomeUsuario = nomeUsuario; // define o nome de usuário
        this.senha = senha; // define a senha do usuário
        this.informacaoAdicional = informacaoAdicional; // define informações adicionais
        this.seguidores = []; // inicia o array de seguidores vazio
        this.seguindo = []; // inicia o array de contas seguidas vazio
        this.posts = []; // inicia o array de posts vazio
        this.mensagensDiretas = []; // inicia o array de mensagens diretas vazio
        this.notificacoes = []; // inicia o array de notificações vazio
    }
    Conta.prototype.seguir = function (conta) {
        if (!this.seguindo.includes(conta.id)) { // verifica se o usuário já está seguindo a conta
            this.seguindo.push(conta.id); // adiciona o ID da conta ao array de contas seguidas
            conta.seguidores.push(this.id); // adiciona o ID do usuário ao array de seguidores da conta seguida
            conta.notificacoes.push(["Novo seguidor", this.id]); // envia uma notificação à conta seguida
        }
    };
    Conta.prototype.enviarMensagem = function (conta, conteudo) {
        conta.mensagensDiretas.push([conteudo, this.id]); // envia uma mensagem direta para a conta
    };
    Conta.prototype.criarPost = function (conteudo) {
        var novoPost = new Post(this.id, conteudo); // cria um novo post com o ID do autor e o conteúdo
        this.posts.push(novoPost); // adiciona o post à lista de posts do usuário
    };
    Conta.idsUtilizados = []; // array estático para armazenar os IDs utilizados
    return Conta;
}());
var Post = /** @class */ (function () {
    function Post(idAutor, conteudo) {
        this.idPost = Post.idPostGlobal++; // gera um ID único para o post
        this.idAutor = idAutor; // define o autor do post
        var dataAtual = new Date(); // obtém a data atual
        this.dataHora = [dataAtual.getDate(), dataAtual.getMonth() + 1, dataAtual.getFullYear()]; // armazena a data no formato [dia, mês, ano]
        this.curtidas = []; // inicia o array de curtidas vazio
        this.comentarios = []; // inicia o array de comentários vazio
    }
    Post.prototype.curtir = function (conta) {
        if (!this.curtidas.includes(conta.id)) { // verifica se a conta já curtiu o post
            this.curtidas.push(conta.id); // adiciona o ID da conta ao array de curtidas
        }
    };
    Post.prototype.comentar = function (conta, comentario) {
        this.comentarios.push([comentario, conta.nomeUsuario]); // adiciona um comentário ao post 
        //com o conteúdo e o nome do usuário
    };
    Post.idPostGlobal = 0; // contador estático para gerar IDs únicos para os posts
    return Post;
}());
var Feed = /** @class */ (function () {
    function Feed() {
        this.contas = []; // inicia a lista de contas vazia
    }
    Feed.prototype.criarConta = function () {
        var nomeUsuario = readlineSync.question('Nome de usuario: ');
        var senha = readlineSync.question('Senha: ', { hideEchoBack: true }); //cria mascara na digitacao
        var informacaoAdicional = readlineSync.question('Informacao adicional: ');
        var novaConta = new Conta(nomeUsuario, senha, informacaoAdicional); // cria uma nova conta
        this.contas.push(novaConta); // adiciona a nova conta à lista de contas
        console.log("Conta criada com sucesso! ID: ".concat(novaConta.id));
        return novaConta; // retorna a nova conta criada
    };
    Feed.prototype.login = function () {
        var nomeUsuario = readlineSync.question('Nome de usuario: ');
        var senha = readlineSync.question('Senha: ', { hideEchoBack: true }); // cria mascara na digitacao
        var conta = this.contas.find(function (c) { return c.nomeUsuario === nomeUsuario && c.senha === senha; }); // busca uma conta com o nome de usuário e senha fornecidos
        if (conta) {
            console.log('Login realizado com sucesso!');
        }
        else {
            console.log('Login falhou. Nome de usuário ou senha incorretos.');
        }
        return conta || null; // retorna a conta se encontrada ou null se não encontrada
    };
    Feed.prototype.logout = function () {
        console.log("Logout realizado com sucesso"); // exibe mensagem de logout realizado
    };
    Feed.prototype.filtrarPosts = function (conta) {
        return this.contas
            .filter(function (c) { return conta.seguindo.includes(c.id); }) // filtra as contas seguidas pelo usuário
            .flatMap(function (c) { return c.posts; }); // retorna os posts das contas seguidas
    };
    return Feed;
}());
// Função principal para gerenciar o menu
function main() {
    var redeSocial = new Feed(); // cria nova instância da classe Feed, 
    //que é responsável por gerenciar contas e posts na rede social.
    var contaLogada = null;
    var _loop_1 = function () {
        console.log('\n[01] Criar conta\n[02] Login\n[03] Logout\n[04] Criar post\n[05] Ver feed\n[06] Seguir usuário\n[07] Enviar mensagem\n[00] Sair');
        var escolha = readlineSync.question('Escolha opcao: ');
        switch (escolha) {
            case '01':
                contaLogada = redeSocial.criarConta();
                break;
            case '02':
                contaLogada = redeSocial.login();
                break;
            case '03':
                if (contaLogada) {
                    redeSocial.logout();
                    contaLogada = null;
                }
                else {
                    console.log('Você não está logado.');
                }
            case '04':
                if (contaLogada) {
                    var conteudo = readlineSync.question('Conteudo do post: ');
                    contaLogada.criarPost(conteudo);
                    console.log('Post criado com sucesso!');
                }
                else {
                    console.log('Você precisa estar logado para criar um post.');
                }
                break;
            case '05':
                if (contaLogada) {
                    var posts = redeSocial.filtrarPosts(contaLogada);
                    if (posts.length > 0) {
                        posts.forEach(function (post) {
                            console.log("Post ID: ".concat(post.idPost, ", Autor: ").concat(post.idAutor, ", Data: ").concat(post.dataHora.join('/'), ", Curtidas: ").concat(post.curtidas.length));
                        });
                    }
                    else {
                        console.log('Nenhum post encontrado no feed.');
                    }
                }
                else {
                    console.log('Você precisa estar logado para ver o feed.');
                }
                break;
            case '06':
                if (contaLogada) {
                    var idParaSeguir_1 = parseInt(readlineSync.question('ID da conta para seguir: '), 10);
                    var contaParaSeguir = redeSocial.contas.find(function (c) { return c.id === idParaSeguir_1; });
                    if (contaParaSeguir) {
                        contaLogada.seguir(contaParaSeguir);
                        console.log("Agora voc\u00EA est\u00E1 seguindo ".concat(contaParaSeguir.nomeUsuario, "."));
                    }
                    else {
                        console.log('Conta não encontrada.');
                    }
                }
                else {
                    console.log('Você precisa estar logado para seguir um usuário.');
                }
                break;
            case '07':
                if (contaLogada) {
                    var idDestino_1 = parseInt(readlineSync.question('ID da conta para enviar mensagem: '), 10);
                    var contaDestino = redeSocial.contas.find(function (c) { return c.id === idDestino_1; });
                    if (contaDestino) {
                        var mensagem = readlineSync.question('Mensagem: ');
                        contaLogada.enviarMensagem(contaDestino, mensagem);
                        console.log('Mensagem enviada com sucesso!');
                    }
                    else {
                        console.log('Conta não encontrada.');
                    }
                }
                else {
                    console.log('Você precisa estar logado para enviar uma mensagem.');
                }
                break;
            case '00':
                console.log('Encerrando o simulador...');
                return { value: void 0 };
                //               case '00':
                //               if (contaLogada) {
                //                   redeSocial.logout()
                //                   contaLogada = null
                //               } else {
                //                   console.log('Você não está logado.')
                //              }
                break;
            default:
                console.log('Opção inválida.');
        }
    };
    // variável contaLogada é declarada. Ela é do tipo Conta ou null, 
    // o que significa que ela pode armazenar uma instância de Conta (quando um usuário está logado) 
    // ou null (quando nenhum usuário está logado).
    // Inicialmente, contaLogada é definida como null porque, no início do programa, nenhum usuário está logado.
    while (true) {
        var state_1 = _loop_1();
        if (typeof state_1 === "object")
            return state_1.value;
    }
}
main();
