

import * as readlineSync from 'readline-sync';

class Conta {
    static idsUtilizados: number[] = [] // array estático para armazenar os IDs utilizados
    id: number // ID único para cada conta
    nomeUsuario: string // nome de usuário
    senha: string // senha para login
    informacaoAdicional: string // informações adicionais sobre o usuário
    seguidores: number[] // IDs das contas que seguem o usuário
    seguindo: number[] // IDs das contas que o usuário atual segue
    posts: Post[] // lista de posts feitos pelo usuário
    mensagensDiretas: [string, number][] // mensagens diretas recebidas, armazenando conteúdo e ID da conta remetente
    notificacoes: [string, number][] // notificações recebidas, com conteúdo e ID da conta que gerou a notificação

    constructor(nomeUsuario: string, senha: string, informacaoAdicional: string) {
        this.id = Conta.idsUtilizados.length + 1 // gera um novo ID com base no tamanho do array de IDs utilizados
        Conta.idsUtilizados.push(this.id) // adiciona o ID ao array de IDs utilizados
        this.nomeUsuario = nomeUsuario // define o nome de usuário
        this.senha = senha // define a senha do usuário
        this.informacaoAdicional = informacaoAdicional // define informações adicionais
        this.seguidores = [] // inicia o array de seguidores vazio
        this.seguindo = [] // inicia o array de contas seguidas vazio
        this.posts = [] // inicia o array de posts vazio
        this.mensagensDiretas = [] // inicia o array de mensagens diretas vazio
        this.notificacoes = [] // inicia o array de notificações vazio
    }

    seguir(conta: Conta) {
        if (!this.seguindo.includes(conta.id)) { // verifica se o usuário já está seguindo a conta
            this.seguindo.push(conta.id) // adiciona o ID da conta ao array de contas seguidas
            conta.seguidores.push(this.id) // adiciona o ID do usuário ao array de seguidores da conta seguida
            conta.notificacoes.push(["Novo seguidor", this.id]) // envia uma notificação à conta seguida
        }
    }

    enviarMensagem(conta: Conta, conteudo: string) {
        conta.mensagensDiretas.push([conteudo, this.id]) // envia uma mensagem direta para a conta
    }

    criarPost(conteudo: string) {
        const novoPost = new Post(this.id, conteudo) // cria um novo post com o ID do autor e o conteúdo
        this.posts.push(novoPost) // adiciona o post à lista de posts do usuário
    }
}

class Post {
    static idPostGlobal: number = 0 // contador estático para gerar IDs únicos para os posts
    idPost: number // ID único do post
    idAutor: number // ID do autor do post
    dataHora: [number, number, number] // data e hora do post, armazenada como [dia, mês, ano]
    curtidas: number[] // IDs das contas que curtiram o post
    comentarios: [string, string][] // comentários no post, armazenando conteúdo e nome de usuário

    constructor(idAutor: number, conteudo: string) {
        this.idPost = Post.idPostGlobal++ // gera um ID único para o post
        this.idAutor = idAutor // define o autor do post
        const dataAtual = new Date() // obtém a data atual
        this.dataHora = [dataAtual.getDate(), dataAtual.getMonth() + 1, dataAtual.getFullYear()] // armazena a data no formato [dia, mês, ano]
        this.curtidas = [] // inicia o array de curtidas vazio
        this.comentarios = [] // inicia o array de comentários vazio
    }

    curtir(conta: Conta) {
        if (!this.curtidas.includes(conta.id)) { // verifica se a conta já curtiu o post
            this.curtidas.push(conta.id) // adiciona o ID da conta ao array de curtidas
        }
    }

    comentar(conta: Conta, comentario: string) {
        this.comentarios.push([comentario, conta.nomeUsuario]) // adiciona um comentário ao post 
                                                               //com o conteúdo e o nome do usuário
    }
}

class Feed {
    contas: Conta[] // lista de contas na rede social

    constructor() {
        this.contas = [] // inicia a lista de contas vazia
    }

    criarConta(): Conta {
        const nomeUsuario = readlineSync.question('Nome de usuario: ')
        const senha = readlineSync.question('Senha: ', { hideEchoBack: true })  //cria mascara na digitacao
        const informacaoAdicional = readlineSync.question('Informacao adicional: ')
        const novaConta = new Conta(nomeUsuario, senha, informacaoAdicional) // cria uma nova conta
        this.contas.push(novaConta) // adiciona a nova conta à lista de contas
        console.log(`Conta criada com sucesso! ID: ${novaConta.id}`)
        return novaConta // retorna a nova conta criada
    }

    login(): Conta | null {
        const nomeUsuario = readlineSync.question('Nome de usuario: ')
        const senha = readlineSync.question('Senha: ', { hideEchoBack: true })   // cria mascara na digitacao
        const conta = this.contas.find(c => c.nomeUsuario === nomeUsuario && c.senha === senha) 
                                      // Esta é uma função callback que define a condição usada pelo .find().
                                      // A função recebe um parâmetro c, que representa uma conta (Conta) individual do array contas.
                                      // busca uma conta com o nome de usuário e senha fornecidos
                                      // A condição c.nomeUsuario === nomeUsuario && c.senha === senha verifica se:
                                      //(nomeUsuario) da conta c é igual ao nome de usuário fornecido como entrada (nomeUsuario)
                                      //se a (senha) da conta c é igual senha fornecida como entrada (senha).
                                      // O resultado da busca (a conta que satisfaz a condição) é armazenado na variável conta.
                                      // Se uma conta correspondente for encontrada, conta será uma instância da classe Conta 
                                      // que representa o usuário que está tentando fazer login.
                                      // caso contrario conta será undefined
     
                                      if (conta) {
            console.log('Login realizado com sucesso!')
        } else {
            console.log('Login falhou. Nome de usuário ou senha incorretos.')
        }
        return conta || null // retorna a conta se encontrada ou null se não encontrada
    }

    logout() {
        console.log("Logout realizado com sucesso") 
    }

    filtrarPosts(conta: Conta): Post[] {
        return this.contas
            .filter(c => conta.seguindo.includes(c.id)) // filtra as contas seguidas pelo usuário
            .flatMap(c => c.posts) // retorna os posts das contas seguidas
    }
}


function main() {
    const redeSocial = new Feed()  // cria nova instância da classe Feed, 
                                   //que é responsável por gerenciar contas e posts na rede social.
    let contaLogada: Conta | null = null
                                  // variável contaLogada é declarada. Ela é do tipo Conta ou null, 
                                  // o que significa que ela pode armazenar uma instância de Conta (quando um usuário está logado) 
                                  // ou null (quando nenhum usuário está logado).
                                  // Inicialmente, contaLogada é definida como null porque, no início do programa, nenhum usuário está logado.

    while (true) {
        console.log('\n[01] Criar conta\n[02] Login\n[03] Logout\n[04] Criar post\n[05] Ver feed\n[06] Seguir usuário\n[07] Enviar mensagem\n[00] Sair')
        const escolha = readlineSync.question('Escolha opcao: ')

        switch (escolha) {
            case '01':
                contaLogada = redeSocial.criarConta()
                break
            case '02':
                contaLogada = redeSocial.login()
                break

            case '03':
                    if (contaLogada) {
                        redeSocial.logout()
                        contaLogada = null
                    } else {
                        console.log('Você não está logado.')
                    }

                
            case '04':
                if (contaLogada) {
                    const conteudo = readlineSync.question('Conteudo do post: ')
                    contaLogada.criarPost(conteudo)
                    console.log('Post criado com sucesso!')
                } else {
                    console.log('Você precisa estar logado para criar um post.')
                }
                break
            case '05':
                if (contaLogada) {
                    const posts = redeSocial.filtrarPosts(contaLogada)
                    if (posts.length > 0) {
                        posts.forEach(post => {
                            console.log(`Post ID: ${post.idPost}, Autor: ${post.idAutor}, Data: ${post.dataHora.join('/')}, Curtidas: ${post.curtidas.length}`)
                        })
                    } else {
                        console.log('Nenhum post encontrado no feed.')
                    }
                } else {
                    console.log('Você precisa estar logado para ver o feed.')
                }
                break
            case '06':
                if (contaLogada) {
                    const idParaSeguir = parseInt(readlineSync.question('ID da conta para seguir: '), 10)
                    const contaParaSeguir = redeSocial.contas.find(c => c.id === idParaSeguir)
                    if (contaParaSeguir) {
                        contaLogada.seguir(contaParaSeguir)
                        console.log(`Agora você está seguindo ${contaParaSeguir.nomeUsuario}.`)
                    } else {
                        console.log('Conta não encontrada.')
                    }
                } else {
                    console.log('Você precisa estar logado para seguir um usuário.')
                }
                break
            case '07':
                if (contaLogada) {
                    const idDestino = parseInt(readlineSync.question('ID da conta para enviar mensagem: '), 10)
                    const contaDestino = redeSocial.contas.find(c => c.id === idDestino)
                    if (contaDestino) {
                        const mensagem = readlineSync.question('Mensagem: ')
                        contaLogada.enviarMensagem(contaDestino, mensagem)
                        console.log('Mensagem enviada com sucesso!')
                    } else {
                        console.log('Conta não encontrada.')
                    }
                } else {
                    console.log('Você precisa estar logado para enviar uma mensagem.')
                }
                break
                case '00':
                    console.log('Encerrando o simulador...')
                    return

 //               case '00':
 //               if (contaLogada) {
 //                   redeSocial.logout()
 //                   contaLogada = null
 //               } else {
 //                   console.log('Você não está logado.')
  //              }
                break


                default:
                console.log('Opção inválida.')
        }
    }
}

main()



