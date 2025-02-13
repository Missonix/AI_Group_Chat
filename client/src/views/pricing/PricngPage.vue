<template>
  <div class="main-content-wrapper">
    <!-- page banner -->
    <div class="page-banner-container">
      <div class="container">
        <div class="row">
          <div class="col-12 col-md-12 col-lg-12">
            <div class="page-banner-wrapper">
              <h1 class="page-banner-heading">每家公司都是内容公司</h1>
              <ul>
                <li><RouterLink to="/">首页</RouterLink></li>
                <li class="divider-bredacrumb">/</li>
                <li><RouterLink to="/pricing">价格</RouterLink></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 价格与购买 pricing -->
    <div class="section pricing">
      <div class="container">
        <div class="row align-items-center justify-content-center">
          <div class="col-12 col-md-8 col-lg-8">
            <div class="section-heading-wrapper">
              <span class="section-small-hading">计划和定价</span>
              <h2 class="section-heading">最适合您业务需求的计划</h2>
              <p class="section-description text-center">
                为您的潜在客户开发、客户支持和客户参与制定合理的计划.
              </p>
            </div>
          </div>
        </div>
        <div class="row mt-4" data-aos="fade-up" data-aos-duration="3000">
          <div
            class="col-12 col-md-4 col-lg-4 mb-4"
            v-for="(card, index) in pricingCards"
            :key="index"
          >
            <div
              :class="['pricing-card', card.cardClass, { selected: card.isSelected }]"
              @click="handleCardSelect(index)"
            >
              <div class="pricing-top">
                <h4>{{ card.type }}</h4>
                <h1>
                  {{ card.price }}
                  <span>{{ card.priceDetail }}</span>
                </h1>
                <a :class="['theme-btn', card.isSelected ? 'btn-secondary' : 'btn-light']" href="#">
                  {{ card.btnText }}
                </a>
              </div>
              <div class="pricing-list">
                <ul>
                  <li v-for="(feature, featureIndex) in card.features" :key="featureIndex">
                    <i class="fa fa-check"></i>{{ feature }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- FQA faq -->
    <FQA />
    <!-- 准备开始 get start -->
    <div class="section get-start">
      <div class="container">
        <div class="row">
          <div class="col-12 col-md-12 col-lg-12">
            <div class="getstart-wrapper">
              <h3>准备开始?</h3>
              <h4>这就像有机会接触到一个由文案专家组成的写作团队 <br />一键为您提供强大的副本.</h4>
              <a class="theme-btn btn-main" href="contact-us.html">Request Demo</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Pricing">
import FQA from '@/components/FQA.vue'
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

interface PricingCard {
  type: string
  price: string
  priceDetail: string
  btnText: string
  btnClass: string
  cardClass: string
  features: string[]
  isSelected?: boolean // 添加选中状态属性
}

const pricingCards = ref<PricingCard[]>([
  {
    type: '标准',
    price: '$9',
    priceDetail: '/每月',
    btnText: '立即试用',
    btnClass: 'btn-light',
    cardClass: 'standard',
    features: [
      '10000个月字数限制',
      '10种+ 模板',
      '30种+ 语言',
      '高级编辑工具',
      '定期技术支持',
      '无限制登录',
      '最新功能',
    ],
    isSelected: false,
  },
  {
    type: '高级',
    price: '$19',
    priceDetail: '/每月',
    btnText: '购买',
    btnClass: 'btn-light',
    cardClass: 'senior',
    features: [
      '10000个月字数限制',
      '10种+ 模板',
      '30种+ 语言',
      '高级编辑工具',
      '定期技术支持',
      '无限制登录',
      '最新功能',
    ],
    isSelected: true, // 默认选中第二个
  },
  {
    type: '团队',
    price: '$39',
    priceDetail: '/每月',
    btnText: '购买',
    btnClass: 'btn-light',
    cardClass: 'team',
    features: [
      '10000个月字数限制',
      '10种+ 模板',
      '30种+ 语言',
      '高级编辑工具',
      '定期技术支持',
      '无限制登录',
      '最新功能',
    ],
    isSelected: false,
  },
])

const handleCardSelect = (index: number) => {
  // 先将所有卡片设置为未选中
  pricingCards.value.forEach((card) => (card.isSelected = false))
  // 设置当前点击的卡片为选中
  pricingCards.value[index].isSelected = true
}

// 确保初始状态正确
onMounted(() => {
  handleCardSelect(1) // 默认选中第二个卡片
})
</script>

<style scoped>
.theme-btn {
  border-radius: 12px;
  height: 48px;
  text-align: center;
  border: none;
  max-width: max-content;
  width: auto;
  padding: 10px 15px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter-Regular';
  font-weight: normal;
  transition: all 0.3s ease;
}
.pricing-card {
  width: 100%;
  position: relative;
  display: inline-block;
  background-color: #fff;
  border-radius: 0.875rem;
  box-shadow: 0px 5px 15px 10px rgb(221 221 221 / 50%);
  height: 100%;
  padding: 30px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
}

.pricing-top h4 {
  margin-bottom: 1rem;
  font-size: 1.125rem;
  text-align: center;
  color: var(--heading-color1);
}

.pricing-top h1 {
  margin-bottom: 1.5rem;
  font-size: 34px;
  text-align: center;
}

.pricing-top h1 span {
  font-size: 0.875rem;
  font-weight: 400;
}

.pricing-top .btn-light {
  width: 100%;
  text-align: center;
  background-color: rgb(51 184 159 / 15%);
  max-width: 100%;
  transition: all 0.3s ease;
}

.pricing-top .btn-secondary {
  width: 100%;
  max-width: 100%;
  color: var(--font-white);
  background-color: var(--theme-color-2);
  transition: all 0.3s ease;
}

.pricing-top .btn-secondary:hover {
  background-color: #171389;
}

.pricing-list ul li {
  display: flex;
  line-height: 1.5rem;
  align-items: center;
  margin-top: 1rem;
}

.pricing-list ul li i {
  margin-right: 10px;
  color: var(--theme-color-3);
  font-size: 10px;
}

.pricing-list ul {
  padding-left: 10px;
}

.pricing-card.selected {
  border: 2px solid var(--theme-color-2);
  transform: translateY(-5px);
}

.pricing-card.selected .pricing-top h4,
.pricing-card.selected .pricing-top h1 {
  color: var(--theme-color-2);
}

.btn-light {
  width: 100%;
  text-align: center;
  background-color: rgb(51 184 159 / 15%);
  max-width: 100%;
  transition: all 0.3s ease;
}

.btn-secondary {
  width: 100%;
  max-width: 100%;
  color: var(--font-white);
  background-color: var(--theme-color-2);
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: #171389;
}

.pricing-card,
.btn-light,
.btn-secondary {
  transition: all 0.3s ease;
}
</style>
