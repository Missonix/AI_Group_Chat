<template>
  <div class="section faq">
    <div class="container">
      <div class="row align-items-center justify-content-center">
        <div class="col-12 col-md-10 col-lg-10">
          <div class="section-heading-wrapper">
            <span class="section-small-hading">FAQ</span>
            <h2 class="section-heading">我们已经为你做好了准备</h2>
          </div>
        </div>
      </div>
      <div
        class="row align-items-center justify-content-center"
        data-aos="fade-up"
        data-aos-duration="3000"
      >
        <div class="col-12 col-md-10 col-lg-8">
          <div class="faq-accordion faq">
            <div class="accordion" id="accordionExample1">
              <div class="accordion-item" v-for="(faq, index) in faqs" :key="index">
                <h2 class="accordion-header" :id="'faqh' + (index + 1)">
                  <button
                    class="accordion-button"
                    type="button"
                    :class="{ collapsed: !faq.isExpanded }"
                    :data-bs-toggle="'collapse'"
                    :data-bs-target="'#faqc' + (index + 1)"
                    :aria-expanded="faq.isExpanded"
                    :aria-controls="'faqc' + (index + 1)"
                    @click="toggleCollapse(index)"
                  >
                    {{ faq.question }}
                  </button>
                </h2>
                <div
                  :id="'faqc' + (index + 1)"
                  class="accordion-collapse collapse"
                  :class="{ show: faq.isExpanded }"
                  :aria-labelledby="'faqh' + (index + 1)"
                  data-bs-parent="#accordionExample1"
                >
                  <div class="accordion-body">
                    <p>{{ faq.answer }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="FQA">
import { ref } from 'vue'

interface FAQ {
  question: string
  answer: string
  isExpanded: boolean
}

const faqs = ref<FAQ[]>([
  {
    question: 'Q. 什么是副本?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    isExpanded: true, // 默认展开第一个
  },
  {
    question: 'Q. AI满足于写长篇文章吗?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    isExpanded: false,
  },
  {
    question: 'Q. 生成的内容是否为原创?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    isExpanded: false,
  },
  {
    question: 'Q. 你有wordpress插件吗?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    isExpanded: false,
  },
])

const toggleCollapse = (index: number) => {
  faqs.value[index].isExpanded = !faqs.value[index].isExpanded
}
</script>

<style scoped></style>
