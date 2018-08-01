const crachaComponent = Vue.component('cracha', {
  directives: {
    mask: VueMask.VueMaskDirective
  },
  props: {
    foto: {
      required: false
    },
    nomeCargo: {
      default: 'NOME\nCARGO'
    },
    nomeCompleto: {
      default: 'Nome Completo'
    },
    rg: {
      default: '0.000.000'
    },
    cpf: {
      default: '000.000.000-00'
    },
    matricula: {
      default: '000000'
    },
    loja: {
      default: 'ENDEREÇO DA LOJA'
    }
  },
  template: `
    <div class="cracha">
        <input style="display: none" 
               type="file" 
               accept="image/*"
               ref="inputFile"
               @change="atribuirImagem">

        <img class="cracha__foto" 
             style="top: 28.5mm; left: 17mm;"
             ref="foto"
             @click="escolherImagem">

        <textarea class="cracha__input cracha__input--nomeCargo no-border no-resize text-center" 
                  rows="2"
                  style="top: 74mm; left: 2mm; height: 17mm;"
                  @click="e => e.target.select()"
                  v-model="nomeCargo"></textarea>

        <textarea class="cracha__input no-border no-resize" 
                  style="top: 9mm; left: 64mm;"
                  @click="e => e.target.select()"
                  v-model="nomeCompleto"></textarea>

        <input class="cracha__input no-border" 
               style="top: 24mm; left: 65mm"
               v-model="rg"
               v-mask="'#.###.###'"
               @click="e => e.target.select()">

        <input class="cracha__input no-border"
               style="top: 39mm; left: 65mm"
               v-model="cpf"
               v-mask="'###.###.###-##'"
               @click="e => e.target.select()">

        <input class="cracha__input no-border"
               style="top: 54mm; left: 65mm"
               v-model="matricula"
               v-mask="'######'"
               @click="e => e.target.select()">

        <textarea class="cracha__input cracha__input--loja no-border no-resize text-center" 
                  rows="2"
                  style="top: 82mm; left: 63mm"
                  @click="e => e.target.select()"
                  v-model="loja"></textarea>
    </div>
  `,
  mounted() {
    this.atualizaImagem(this.foto)
  },
  watch: {
    foto(value) {
      this.atualizaImagem(value)
    }
  },
  methods: {
    atualizaImagem(imagem) {
      if (!imagem) {
        return
      }

      this.$refs.foto.src = imagem
    },
    escolherImagem() {
      this.$refs.inputFile.click()
    },
    atribuirImagem() {
      const files = this.$refs.inputFile.files
      if (!files.length) {
        return
      }

      const reader = new FileReader()
      reader.addEventListener('load', () => { this.foto = reader.result }, false )
      reader.readAsDataURL(files[0])
    },
    export() {
      return {
        foto: this.foto,
        nomeCargo: this.nomeCargo,
        nomeCompleto: this.nomeCompleto,
        rg: this.rg,
        cpf: this.cpf,
        matricula: this.matricula,
        loja: this.loja,
      }
    }
  }
})

new Vue({
  el: '#app',
  created() {
    this.$options.limiteCrachas = 4
  },
  mounted() {
    this.incluiCracha()
  },
  data() {
    return {
      crachas: []
    }
  },
  computed: {
    isPaginaCompleta() {
      return this.crachas.length >= this.$options.limiteCrachas
    },
    isPaginaVazia() {
      return this.crachas.length < 1
    }
  },
  methods: {
    criaCracha(propsData = {}) {
      const newCracha = new crachaComponent({ propsData })
      return newCracha.$mount()
    },
    incluiCracha(propsData = {}) {
      const cracha = this.criaCracha(propsData)
      this.$refs.page.appendChild(cracha.$el)
      this.crachas.push(cracha)
    },
    removeCracha() {
      const cracha = this.crachas.pop()
      this.$refs.page.removeChild(cracha.$el)
    },
    removeTodosCrachas() {
      while (this.crachas.length) {
        this.removeCracha()
      }
    },
    salvar() {
      const dadosCrachas = this.crachas.map(c => c.export())
      localStorage.setItem('crachas', JSON.stringify(dadosCrachas))
      alert('Salvo com sucesso!')
    },
    restaurar() {
      const json = localStorage.getItem('crachas')
      if (!json) {
        return alert('Nenhum backup disponível...')
      }
      const dadosCrachas = JSON.parse(json)

      this.limpaCrachas()

      dadosCrachas.map(cracha => this.incluiCracha(cracha))
    },
    imprimir() {
      print()
    }
  }
})
