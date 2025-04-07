// 个人中心页面脚本

// 等待DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 初始化导航切换功能
  initNavigation();
  
  // 初始化表单事件监听
  initFormListeners();
  
  // 初始化视图切换功能
  initViewToggle();
  
  // 初始化主题切换功能
  initThemeToggle();
});

// 初始化导航切换功能
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const contentSections = document.querySelectorAll('.content-section');
  
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      // 移除所有导航项的active类
      navItems.forEach(nav => nav.classList.remove('active'));
      
      // 为当前点击的导航项添加active类
      this.classList.add('active');
      
      // 获取目标内容区域的ID
      const targetId = this.getAttribute('data-target');
      
      // 隐藏所有内容区域
      contentSections.forEach(section => section.classList.remove('active'));
      
      // 显示目标内容区域
      document.getElementById(targetId).classList.add('active');
    });
  });
}

// 初始化表单事件监听
function initFormListeners() {
  // 语言选择变更事件
  const languageSelect = document.querySelector('.language-select');
  if (languageSelect) {
    languageSelect.addEventListener('change', function() {
      showToast(`界面语言已切换为: ${this.options[this.selectedIndex].text}`);
    });
  }
  
  // 模型选择变更事件
  const modelSelect = document.querySelector('.model-select');
  if (modelSelect) {
    modelSelect.addEventListener('change', function() {
      showToast(`默认模型已设置为: ${this.options[this.selectedIndex].text}`);
    });
  }
  
  // 清空历史按钮点击事件
  const clearHistoryBtn = document.querySelector('.clear-history-btn');
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', function() {
      if (confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
        // 这里应该添加清空历史记录的逻辑
        const historyList = document.querySelector('.history-list');
        if (historyList) {
          historyList.innerHTML = '<p class="empty-message">暂无历史记录</p>';
        }
        showToast('历史记录已清空');
      }
    });
  }
  
  // 编辑资料按钮点击事件
  const editProfileBtn = document.querySelector('.edit-profile-btn');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', function() {
      showToast('编辑资料功能即将上线');
    });
  }
  
  // 编辑头像按钮点击事件
  const editAvatarBtn = document.querySelector('.edit-avatar-btn');
  if (editAvatarBtn) {
    editAvatarBtn.addEventListener('click', function() {
      showToast('头像编辑功能即将上线');
    });
  }
  
  // 安全设置按钮点击事件
  const securityBtns = document.querySelectorAll('.security-btn');
  securityBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      showToast('安全设置功能即将上线');
    });
  });
  
  // 历史记录和收藏夹操作按钮点击事件
  const actionBtns = document.querySelectorAll('.action-btn');
  actionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const action = this.getAttribute('title');
      showToast(`${action}功能即将上线`);
    });
  });
}

// 初始化视图切换功能
function initViewToggle() {
  const viewBtns = document.querySelectorAll('.view-btn');
  const favoritesGrid = document.querySelector('.favorites-grid');
  
  viewBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // 移除所有视图按钮的active类
      viewBtns.forEach(b => b.classList.remove('active'));
      
      // 为当前点击的按钮添加active类
      this.classList.add('active');
      
      // 获取视图类型
      const viewType = this.getAttribute('data-view');
      
      // 根据视图类型切换布局
      if (favoritesGrid) {
        if (viewType === 'grid') {
          favoritesGrid.style.display = 'grid';
        } else if (viewType === 'list') {
          favoritesGrid.style.display = 'flex';
          favoritesGrid.style.flexDirection = 'column';
          favoritesGrid.style.gap = '1rem';
        }
      }
    });
  });
}

// 初始化主题切换功能
function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = themeToggle.querySelector('i');
  
  // 检查本地存储中的主题设置
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  
  // 根据主题设置更新图标
  updateThemeIcon(themeIcon, isDarkMode);
  
  themeToggle.addEventListener('click', function() {
    // 切换主题模式
    const currentMode = localStorage.getItem('darkMode') === 'true';
    const newMode = !currentMode;
    
    // 更新本地存储
    localStorage.setItem('darkMode', newMode);
    
    // 更新图标
    updateThemeIcon(themeIcon, newMode);
    
    // 显示提示
    showToast(`已切换到${newMode ? '深色' : '浅色'}模式`);
  });
}

// 更新主题图标
function updateThemeIcon(iconElement, isDarkMode) {
  if (isDarkMode) {
    iconElement.classList.remove('ri-sun-line');
    iconElement.classList.add('ri-moon-line');
  } else {
    iconElement.classList.remove('ri-moon-line');
    iconElement.classList.add('ri-sun-line');
  }
}

// 显示提示消息
function showToast(message) {
  // 检查是否已存在toast元素
  let toast = document.querySelector('.toast');
  
  // 如果不存在，创建一个新的toast元素
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
    
    // 添加toast样式
    const style = document.createElement('style');
    style.textContent = `
      .toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--color-primary);
        color: white;
        padding: 12px 20px;
        border-radius: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
        font-weight: 500;
      }
      .toast.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    `;
    document.head.appendChild(style);
  }
  
  // 设置消息内容
  toast.textContent = message;
  
  // 显示toast
  toast.classList.add('show');
  
  // 3秒后隐藏toast
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// 在index.html中添加跳转到个人中心页面的功能
function redirectToUserCenter() {
  window.location.href = 'user-center.html';
}