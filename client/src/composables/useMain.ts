// src/composables/useMain.ts
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

export function useMain() {
  // Scroll event handler
  const navbarTop = ref<HTMLElement | null>(null)
  const showBackToTop = ref<boolean>(false)

  const handleScroll = () => {
    if (document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
      navbarTop.value?.classList.add('scrolled')
      showBackToTop.value = true
    } else {
      navbarTop.value?.classList.remove('scrolled')
      showBackToTop.value = false
    }
  }

  // Email validation
  const email = ref<string>('')
  const emailError = ref<boolean>(false)
  const emailValid = ref<boolean>(false)

  const validateEmail = () => {
    const expr =
      /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    emailError.value = !expr.test(email.value)
    emailValid.value = !emailError.value
  }

  // Countdown timer
  const timer = ref({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const updateTimer = () => {
    const endTime = new Date('26 June 2024 9:56:00 GMT+01:00')
    const now = new Date()
    const timeLeft = Math.floor((endTime.getTime() - now.getTime()) / 1000)

    timer.value.days = Math.floor(timeLeft / 86400)
    timer.value.hours = Math.floor((timeLeft % 86400) / 3600)
    timer.value.minutes = Math.floor((timeLeft % 3600) / 60)
    timer.value.seconds = timeLeft % 60
  }

  // Back to top scroll function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 轮播配置
  const partnersSwiper = {
    modules: [Autoplay],
    slidesPerView: 5,
    spaceBetween: 30,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
      },
      480: {
        slidesPerView: 2,
      },
      640: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 5,
      },
    },
  }

  const testimonialSwiper = {
    modules: [Autoplay, Pagination],
    slidesPerView: 3,
    spaceBetween: 30,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      640: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  }

  // 加载动画
  const isLoading = ref(true)

  onMounted(() => {
    // Initialize scroll event listener
    window.addEventListener('scroll', handleScroll)
    // Initialize countdown timer
    setInterval(updateTimer, 1000)

    // Initialize AOS
    import('aos').then((AOS) => {
      AOS.init()
    })

    // 处理加载动画
    setTimeout(() => {
      isLoading.value = false
    }, 2000)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    navbarTop,
    showBackToTop,
    timer,
    scrollToTop,
    validateEmail,
    email,
    emailError,
    emailValid,
    isLoading,
    partnersSwiper,
    testimonialSwiper,
  }
}
