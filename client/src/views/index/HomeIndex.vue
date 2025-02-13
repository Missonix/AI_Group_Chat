<template>
  <!-- content -->
  <div class="main-content-wrapper">
    <!-- main banner -->
    <div class="main-banner-container">
      <div class="container h-100">
        <div class="row align-items-center justify-content-center h-100">
          <div class="col-12 col-md-10 col-lg-8 h-100">
            <div class="main-banner-wrapper" data-aos="fade-up" data-aos-duration="3000">
              <div class="banner-info-quote">
                <span>New</span>
                <h4>AI增强内容助您成功<i class="fa fa-arrow-right"></i></h4>
              </div>
              <h1 class="main-banner-heading">通过我们的人工智能驱动内容释放创造力和效率</h1>
              <h4 class="main-banner-description">
                AI写作助手，助您在短短几分钟内创作出高质量的内容 只需几秒钟，成本很低！
              </h4>
              <div class="banner-btns">
                <a href="#" class="theme-btn btn-main">了解更多</a>
                <RouterLink class="theme-btn btn-main" to="/chat">开始免费生成</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 功能展示 features -->
  <div class="section features">
    <div class="background-img">
      <img class="img-fluid" src="@/assets/picture/blur-e.png" alt="img" />
    </div>
    <div class="container">
      <div class="row" data-aos="fade-up" data-aos-duration="3000">
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="features-card faster">
            <div class="features-icon">
              <img class="img-fluid" src="../../assets/picture/speedometer.png" alt="img" />
            </div>
            <div class="features-content">
              <h3>写博客快10倍</h3>
              <p>向你解释一下，我们是如何完成的</p>
              <a href="#">尝试博客内容中心<i class="fa fa-long-arrow-right"></i></a>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="features-card posts">
            <div class="features-icon">
              <img class="img-fluid" src="@/assets/picture/edit.png" alt="img" />
            </div>
            <div class="features-content">
              <h3>撰写转化率更高的帖子</h3>
              <p>向你解释一下，我们是如何完成的</p>
              <a href="#">尝试博客内容中心<i class="fa fa-long-arrow-right"></i></a>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="features-card chat">
            <div class="features-icon">
              <img class="img-fluid" src="@/assets/picture/chat.png" alt="img" />
            </div>
            <div class="features-content">
              <h3>随时随地获取你想知道的</h3>
              <p>向你解释一下，我们是如何完成的</p>
              <a href="#">尝试博客内容中心<i class="fa fa-long-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 成功展示 partners -->
  <div class="section partners pt-4">
    <div class="container">
      <div class="row align-items-center justify-content-center">
        <div class="col-12 col-md-10 col-lg-10">
          <div class="partners-heading">
            <h4>已被世界各国领导人选定</h4>
          </div>
          <div class="carosel-root">
            <Swiper v-bind="partnersSwiper">
              <SwiperSlide v-for="(partner, index) in partners" :key="index">
                <div class="partners-img-wrapper">
                  <img class="img-fluid" :src="partner.src" :alt="partner.alt" />
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 功能具体展示 howitworks -->
  <div class="section howitworks">
    <div class="howitworks-top-bg">
      <img class="img-fluid" src="@/assets/picture/blur-d.png" alt="Img" />
    </div>
    <div class="howitworks-bottom-bg">
      <img class="img-fluid" src="@/assets/picture/blur-e.png" alt="Img" />
    </div>
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-10 col-lg-5 section-heading-wrapper">
          <span class="section-small-hading">它是如何工作的</span>
          <h2 class="section-heading">通过三个简单步骤轻松实现</h2>
          <p class="section-description">
            尖端、用户友好的人工智能工具和旨在提升用户的增长分析 转化、参与和保留。
          </p>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-12 col-md-6 col-lg-6 mb-4" data-aos="fade-right" data-aos-duration="3000">
          <div class="howitworks-content-wrapper one">
            <span class="howitworks-content-count">01</span>
            <h3>选择模板</h3>
            <p>
              让人工智能根据资格、经验和技能对申请人进行分析和排名，
              确保你首先关注最有前途的候选人。
            </p>
            <ul>
              <li>
                <img class="img-fluid" src="@/assets/picture/checklist.png" alt="img" />
                <p>At vero eos et accusamus et iusto</p>
              </li>
              <li>
                <img class="img-fluid" src="@/assets/picture/checklist.png" alt="img" />
                <p>At vero eos et accusamus et iusto</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-6 mb-4" data-aos="fade-left" data-aos-duration="3000">
          <div class="howitworks-image-wrapper">
            <div class="howitworks-bg">
              <img class="img-fluid" src="@/assets/picture/rect-1.png" alt="Img" />
            </div>
            <img class="img-fluid content-image" src="@/assets/picture/p-a.jpg" alt="Img" />
          </div>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-12 col-md-6 col-lg-6 mb-4" data-aos="fade-right" data-aos-duration="3000">
          <div class="howitworks-image-wrapper">
            <div class="howitworks-bg">
              <img class="img-fluid" src="@/assets/picture/rect-2.png" alt="Img" />
            </div>
            <img class="img-fluid content-image" src="@/assets/picture/p-b.jpg" alt="Img" />
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-6 mb-4" data-aos="fade-left" data-aos-duration="3000">
          <div class="howitworks-content-wrapper one">
            <span class="howitworks-content-count">02</span>
            <h3>填写您的产品详细信息</h3>
            <p>让AI根据资格、经验和技能对申请人进行分析和排名， 确保你首先关注最有前途的候选人。</p>
            <ul>
              <li>
                <img class="img-fluid" src="@/assets/picture/checklist.png" alt="img" />
                <p>At vero eos et accusamus et iusto</p>
              </li>
              <li>
                <img class="img-fluid" src="@/assets/picture/checklist.png" alt="img" />
                <p>At vero eos et accusamus et iusto</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-12 col-md-6 col-lg-6 mb-4" data-aos="fade-right" data-aos-duration="3000">
          <div class="howitworks-content-wrapper one">
            <span class="howitworks-content-count">03</span>
            <h3>生成AI内容</h3>
            <p>让AI根据资格、经验和技能对申请人进行分析和排名， 确保你首先关注最有前途的候选人。</p>
            <ul>
              <li>
                <img class="img-fluid" src="@/assets/picture/checklist.png" alt="img" />
                <p>At vero eos et accusamus et iusto</p>
              </li>
              <li>
                <img class="img-fluid" src="@/assets/picture/checklist.png" alt="img" />
                <p>At vero eos et accusamus et iusto</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-6 mb-4" data-aos="fade-left" data-aos-duration="3000">
          <div class="howitworks-image-wrapper">
            <div class="howitworks-bg">
              <img class="img-fluid" src="@/assets/picture/rect-3.png" alt="Img" />
            </div>
            <img class="img-fluid content-image" src="@/assets/picture/p-c.jpg" alt="Img" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 能实现的价值 include -->
  <div class="section include">
    <div class="include-bg">
      <img class="img-fluid" src="@/assets/picture/blur-d.png" alt="Img" />
    </div>
    <div class="container">
      <div class="row align-items-center justify-content-center">
        <div class="col-12 col-md-10 col-lg-5">
          <div class="section-heading-wrapper">
            <span class="section-small-hading">包括在内的</span>
            <h2 class="section-heading">根据您的需求量身定制的强大功能</h2>
            <p class="section-description">获得对全球人才市场的宝贵数据驱动见解.</p>
          </div>
        </div>
      </div>
      <div class="row mt-4" data-aos="fade-up" data-aos-duration="3000">
        <div class="col-12 col-md-6 col-lg-4 mb-4" v-for="(item, index) in items" :key="index">
          <div class="include-list-wrapper">
            <div class="include-list-icon">
              <img class="img-fluid" :src="item.icon" :alt="item.alt" />
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 请求演示 divider block -->
  <div class="section lasting-impression pt-0" data-aos="fade-up" data-aos-duration="3000">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-12 col-lg-12">
          <div class="lm-wrapper">
            <div>
              <h3>与AI 模型建立持久印象</h3>
              <h4>
                了解为什么招聘经理更喜欢Hirevision而不是竞争对手，以及是什么让
                它是市场上最简单、最强大的视频面试平台
              </h4>
            </div>
            <a class="theme-btn btn-main" href="contact-us.html">请求演示</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 数据展示 metrics -->
  <div class="section metrics">
    <div class="container">
      <div
        class="row align-items-center justify-content-center col-12 col-md-10 col-lg-10 section-heading-wrapper"
      >
        <span class="section-small-hading">Mertics</span>
        <h2 class="section-heading">数字为自己说话</h2>
      </div>
      <div class="row" data-aos="fade-right" data-aos-duration="3000">
        <div
          class="col-12 col-md-6 col-lg-4 mb-4"
          v-for="(factor, index) in funFactors"
          :key="index"
        >
          <div class="funfactor-wrapper">
            <h1>{{ factor.value }}</h1>
            <h3>{{ factor.description }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 客户评价 testimonials -->
  <div class="section testimonial">
    <div class="container">
      <div
        class="row align-items-center justify-content-center col-12 col-md-10 col-lg-10 section-heading-wrapper"
      >
        <span class="section-small-hading">客户评价</span>
        <h2 class="section-heading">别只相信我们的话</h2>
      </div>
      <div class="row">
        <div class="col-12 col-md-11 col-lg-11 carosel-root carosel testi">
          <Swiper v-bind="testimonialSwiper">
            <SwiperSlide v-for="(testimonial, index) in testimonials" :key="index">
              <div class="testi-card-wrapper" :class="['voilet', 'yellow', 'green'][index % 3]">
                <p>{{ testimonial.quote }}</p>
                <div class="testi-author">
                  <img class="img-fluid" :src="testimonial.imgSrc" :alt="testimonial.name" />
                  <p>{{ testimonial.author }}</p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div class="col-12 col-md-11 col-lg-11">
          <div class="button-block middle">
            <a class="theme-btn btn-norder-green" href="#">More Stories</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- QA问题及解决方案 faq -->
  <FQA />

  <!-- 博客 blog -->
  <div class="section blog pt-2">
    <div class="container">
      <div
        class="row align-items-center justify-content-center col-12 col-md-10 col-lg-10 section-heading-wrapper"
      >
        <span class="section-small-hading">Blog</span>
        <h2 class="section-heading">From our Blog</h2>
      </div>
      <div
        class="row align-items-center justify-content-center"
        data-aos="fade-up"
        data-aos-duration="3000"
      >
        <div class="row">
          <div class="col-12 col-md-6 col-lg-4 mb-4" v-for="(blog, index) in blogs" :key="index">
            <div class="blog-wrapper">
              <a class="blog-image" :href="blog.link">
                <img class="img-fluid" :src="blog.image" :alt="blog.title" />
              </a>
              <span class="blog-badge">{{ blog.category }}</span>
              <a class="blog-heading" :href="blog.link">
                <h3>{{ blog.title }}</h3>
              </a>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-11 col-lg-11">
          <div class="button-block middle">
            <a class="theme-btn btn-norder-green" href="#">More Articles</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 准备开始 get start -->
  <div class="section get-start">
    <div class="container">
      <div class="row col-12 col-md-12 col-lg-12 getstart-wrapper">
        <h3>准备开始?</h3>
        <h4>这就像有一个由文案专家组成的团队在撰写强大的文案 只需一键即可为您服务。</h4>
        <a class="theme-btn btn-main" href="contact-us.html">Request Demo</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="HomeIndex">
import { ref } from 'vue'
import { useMain } from '@/composables/useMain'
import { Swiper, SwiperSlide } from 'swiper/vue'
import FQA from '@/components/FQA.vue'

const { partnersSwiper, testimonialSwiper } = useMain()

interface Partner {
  src: string
  alt: string
}

interface Item {
  icon: string
  alt: string
  title: string
  description: string
}

interface FunFactor {
  value: string // 使用 string，因为数值可能包含 "+" 或 "%"
  description: string
}

interface Testimonial {
  quote: string
  imgSrc: string
  name: string
  author: string
}

interface Blog {
  title: string
  category: string
  image: string
  link: string
}

// 导入所有图片
import partner1 from '@/assets/picture/partner-1.svg'
import partner2 from '@/assets/picture/partner-2.svg'
import partner3 from '@/assets/picture/partner-3.svg'
import partner4 from '@/assets/picture/partner-4.svg'
import partner5 from '@/assets/picture/partner-5.svg'

import findIcon from '@/assets/picture/find.png'
import globalNavIcon from '@/assets/picture/global-navigation.png'
import dataDrivenIcon from '@/assets/picture/data-driven.png'
import simplifyIcon from '@/assets/picture/simplify.png'
import needIcon from '@/assets/picture/need.png'
import focusIcon from '@/assets/picture/focus.png'

import teamImg1 from '@/assets/picture/our-team-1.jpg'
import teamImg2 from '@/assets/picture/our-team-2.jpg'
import teamImg3 from '@/assets/picture/our-team-3.jpg'
import teamImg4 from '@/assets/picture/our-team-4.jpg'

import blogImg1 from '@/assets/picture/blog-1.png'
import blogImg2 from '@/assets/picture/blog-2.png'
import blogImg3 from '@/assets/picture/blog-3.png'

const partners: Partner[] = [
  { src: partner1, alt: 'Partner 1' },
  { src: partner2, alt: 'Partner 2' },
  { src: partner3, alt: 'Partner 3' },
  { src: partner4, alt: 'Partner 4' },
  { src: partner5, alt: 'Partner 5' },
]

const items: Item[] = [
  {
    icon: findIcon,
    alt: '找到你的完美搭配',
    title: '找到你的完美搭配',
    description: '使您能够做出明智的招聘决策，并在竞争中保持领先地位.',
  },
  {
    icon: globalNavIcon,
    alt: '轻松在全球范围内招聘',
    title: '轻松在全球范围内招聘',
    description: '使您能够做出明智的招聘决策，并在竞争中保持领先地位.',
  },
  {
    icon: dataDrivenIcon,
    alt: '做出数据驱动的决策',
    title: '做出数据驱动的决策',
    description: '使您能够做出明智的招聘决策，并在竞争中保持领先地位.',
  },
  {
    icon: simplifyIcon,
    alt: '简化您的招聘流程',
    title: '简化您的招聘流程',
    description: '使您能够做出明智的招聘决策，并在竞争中保持领先地位.',
  },
  {
    icon: needIcon,
    alt: '根据您的需求量身定制',
    title: '根据您的需求量身定制',
    description: '使您能够做出明智的招聘决策，并在竞争中保持领先地位.',
  },
  {
    icon: focusIcon,
    alt: '专注于最合适的设计',
    title: '专注于最合适的设计',
    description: '使您能够做出明智的招聘决策，并在竞争中保持领先地位.',
  },
]

const funFactors: FunFactor[] = [
  { value: '75%', description: '候选人匹配率' },
  { value: '4000+', description: '成功安置' },
  { value: '50+', description: '运营国家' },
]

const testimonials: Testimonial[] = [
  {
    quote:
      '作为一家快速增长的初创公司，我们需要一种有效的方法来寻找熟练的人才来自不同地区的专业人士。这个AI工具超出了我们的预期。',
    imgSrc: teamImg1,
    name: 'Michael Chen',
    author: 'HR Director at Acme Enterprises.',
  },
  {
    quote:
      '作为一家快速增长的初创公司，我们需要一种有效的方法来寻找熟练的人才来自不同地区的专业人士。这个AI工具超出了我们的预期。',
    imgSrc: teamImg2,
    name: 'Michael Chen',
    author: 'HR Director at Acme Enterprises.',
  },
  {
    quote:
      '作为一家快速增长的初创公司，我们需要一种有效的方法来寻找熟练的人才来自不同地区的专业人士。这个AI工具超出了我们的预期。',
    imgSrc: teamImg3,
    name: 'Michael Chen',
    author: 'HR Director at Acme Enterprises.',
  },
  {
    quote:
      '作为一家快速增长的初创公司，我们需要一种有效的方法来寻找熟练的人才来自不同地区的专业人士。这个AI工具超出了我们的预期。',
    imgSrc: teamImg4,
    name: 'Michael Chen',
    author: 'HR Director at Acme Enterprises.',
  },
]

const blogs = ref<Blog[]>([
  {
    title: 'What Is An AI Writing Assistant, And How Is It',
    category: 'Articles',
    image: blogImg1,
    link: '#',
  },
  {
    title: '15 Uses of Content Generator Tools and Why',
    category: 'Articles',
    image: blogImg2,
    link: '#',
  },
  {
    title: '5 Reasons Why CopyGenAI Is the Best AI Writing',
    category: 'Articles',
    image: blogImg3,
    link: '#',
  },
])
</script>

<style scoped>
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
