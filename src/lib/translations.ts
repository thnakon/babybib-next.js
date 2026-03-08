export const translations = {
  EN: {
    nav: {
      help: "Help",
      guides: "Guides",
      generate: "Generate",
      more: "More",
      share: "Share",
      contact: "Contact",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      signIn: "Sign in",
    },
    home: {
      badge: "Smart ISBN Search",
      new: "New",
      heroTitlePart1: "Manage",
      heroTitleHighlight: "your library",
      heroTitlePart2: "with smooth style",
      heroDesc: "A fully featured, open-source book management system. Browse a list of books, track collections and ISBNs that you can install and use in your projects.",
      btnGetStarted: "Get Started →",
      btnBrowse: "Browse Collections",
      gridPrimitives: "Primitives",
      gridComponents: "Components",
      gridIcons: "Icons",
      gridSoon: "Soon...",
    }
  },
  TH: {
    nav: {
      help: "ช่วยเหลือ",
      guides: "คู่มือ",
      generate: "สร้าง",
      more: "เพิ่มเติม",
      share: "แชร์",
      contact: "ติดต่อเรา",
      terms: "ข้อตกลงการใช้งาน",
      privacy: "นโยบายความเป็นส่วนตัว",
      signIn: "เข้าสู่ระบบ",
    },
    home: {
      badge: "ค้นหา ISBN อัจฉริยะ",
      new: "ใหม่",
      heroTitlePart1: "จัดการ",
      heroTitleHighlight: "ห้องสมุดของคุณ",
      heroTitlePart2: "อย่างราบรื่นและมีสไตล์",
      heroDesc: "ระบบจัดการหนังสือโอเพนซอร์สที่มีฟีเจอร์ครบครัน ค้นหารายชื่อหนังสือ ติดตามคอลเล็กชัน และจัดการ ISBN ที่คุณสามารถติดตั้งและใช้งานได้ในโปรเจกต์ของคุณ",
      btnGetStarted: "เริ่มต้นใช้งาน →",
      btnBrowse: "เรียกดูคอลเล็กชัน",
      gridPrimitives: "โครงสร้างหลัก",
      gridComponents: "ส่วนประกอบ",
      gridIcons: "ไอคอน",
      gridSoon: "เร็วๆ นี้...",
    }
  },
  ZH: {
    nav: {
      help: "帮助",
      guides: "指南",
      generate: "生成",
      more: "更多",
      share: "分享",
      contact: "联系我们",
      terms: "服务条款",
      privacy: "隐私政策",
      signIn: "登录",
    },
    home: {
      badge: "智能 ISBN 搜索",
      new: "全新",
      heroTitlePart1: "轻松管理",
      heroTitleHighlight: "您的图书库",
      heroTitlePart2: "，享受流畅风格",
      heroDesc: "一个全功能、开源的图书管理系统。浏览图书列表，追踪藏书和 ISBN 编码，您可以轻松安装并应用于自己的项目中。",
      btnGetStarted: "开始使用 →",
      btnBrowse: "浏览藏书库",
      gridPrimitives: "基础框架",
      gridComponents: "核心组件",
      gridIcons: "图标素材",
      gridSoon: "敬请期待...",
    }
  }
} as const;

export type Language = keyof typeof translations;
