// 文章页面专用JavaScript

// 阅读进度条
document.addEventListener('DOMContentLoaded', function() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);

    function updateReadingProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateReadingProgress);
});

// 代码高亮（使用Prism.js的简化版本）
function highlightCode() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        // 添加语言类
        if (!block.className) {
            block.className = 'language-javascript';
        }
        
        // 简单的语法高亮
        let html = block.innerHTML;
        
        // 关键字
        html = html.replace(/\b(const|let|var|function|return|if|else|for|while|class|extends|import|export|from|as|new|this|super|async|await|try|catch|finally|throw)\b/g, 
            '<span class="token keyword">$1</span>');
        
        // 字符串
        html = html.replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, 
            '<span class="token string">$1$2$3</span>');
        
        // 注释
        html = html.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, 
            '<span class="token comment">$1</span>');
        
        // 函数名
        html = html.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, 
            '<span class="token function">$1</span>');
        
        // 数字
        html = html.replace(/\b\d+\.?\d*\b/g, 
            '<span class="token number">$&</span>');
        
        block.innerHTML = html;
    });
}

// 文章分享功能
function setupShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const articleUrl = window.location.href;
    const articleTitle = document.querySelector('.article-title').textContent;
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            let shareUrl = '';
            const platform = this.classList.contains('twitter') ? 'twitter' :
                           this.classList.contains('facebook') ? 'facebook' :
                           this.classList.contains('linkedin') ? 'linkedin' : 'wechat';
            
            switch(platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;
                    break;
                case 'wechat':
                    // 这里可以实现微信分享
                    alert('请使用微信扫一扫功能分享此页面');
                    return;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// 评论功能
function setupCommentSystem() {
    const commentForm = document.querySelector('.comment-form form');
    const commentsList = document.querySelector('.comments-list');
    
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            if (!name || !email || !message) {
                alert('请填写所有必填字段！');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('请输入有效的邮箱地址！');
                return;
            }
            
            // 创建新评论
            const newComment = createCommentElement(name, message);
            commentsList.insertBefore(newComment, commentsList.firstChild);
            
            // 清空表单
            this.reset();
            
            // 显示成功消息
            showNotification('评论发布成功！');
        });
    }
}

function createCommentElement(name, message) {
    const comment = document.createElement('div');
    comment.className = 'comment';
    
    const avatar = document.createElement('img');
    avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    avatar.alt = `${name}的头像`;
    avatar.className = 'comment-avatar';
    
    const content = document.createElement('div');
    content.className = 'comment-content';
    
    const header = document.createElement('div');
    header.className = 'comment-header';
    
    const author = document.createElement('h4');
    author.textContent = name;
    
    const date = document.createElement('span');
    date.textContent = new Date().toLocaleDateString('zh-CN');
    
    const text = document.createElement('p');
    text.textContent = message;
    
    header.appendChild(author);
    header.appendChild(date);
    content.appendChild(header);
    content.appendChild(text);
    
    comment.appendChild(avatar);
    comment.appendChild(content);
    
    return comment;
}

// 文章目录生成
function generateTableOfContents() {
    const headings = document.querySelectorAll('.article-body h2, .article-body h3');
    if (headings.length === 0) return;
    
    const toc = document.createElement('div');
    toc.className = 'table-of-contents';
    toc.innerHTML = '<h3>目录</h3><ul></ul>';
    
    const tocList = toc.querySelector('ul');
    
    headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${id}`;
        link.textContent = heading.textContent;
        link.className = heading.tagName.toLowerCase();
        
        li.appendChild(link);
        tocList.appendChild(li);
        
        // 平滑滚动
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById(id).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    // 将目录插入到文章开头
    const articleBody = document.querySelector('.article-body');
    if (articleBody) {
        articleBody.insertBefore(toc, articleBody.firstChild);
    }
}

// 打印功能
function setupPrintButton() {
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '<i class="fas fa-print"></i> 打印文章';
    printBtn.className = 'print-btn';
    printBtn.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        padding: 10px 15px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(printBtn);
    
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    // 在滚动时隐藏/显示打印按钮
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            printBtn.style.opacity = '0';
            printBtn.style.pointerEvents = 'none';
        } else {
            printBtn.style.opacity = '1';
            printBtn.style.pointerEvents = 'auto';
        }
        lastScrollTop = scrollTop;
    });
}

// 文章收藏功能
function setupBookmarkFeature() {
    const bookmarkBtn = document.createElement('button');
    bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i>';
    bookmarkBtn.className = 'bookmark-btn';
    bookmarkBtn.title = '收藏文章';
    bookmarkBtn.style.cssText = `
        position: fixed;
        top: 170px;
        right: 20px;
        width: 40px;
        height: 40px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 50%;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(bookmarkBtn);
    
    // 检查是否已收藏
    const articleId = window.location.pathname;
    if (localStorage.getItem(`bookmarked_${articleId}`)) {
        bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
        bookmarkBtn.classList.add('bookmarked');
    }
    
    bookmarkBtn.addEventListener('click', function() {
        if (this.classList.contains('bookmarked')) {
            localStorage.removeItem(`bookmarked_${articleId}`);
            this.innerHTML = '<i class="far fa-bookmark"></i>';
            this.classList.remove('bookmarked');
            showNotification('已取消收藏');
        } else {
            localStorage.setItem(`bookmarked_${articleId}`, 'true');
            this.innerHTML = '<i class="fas fa-bookmark"></i>';
            this.classList.add('bookmarked');
            showNotification('文章已收藏');
        }
    });
}

// 阅读时间估算
function estimateReadingTime() {
    const articleText = document.querySelector('.article-body').textContent;
    const wordCount = articleText.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // 假设平均阅读速度为200词/分钟
    
    const readingTimeElement = document.createElement('div');
    readingTimeElement.className = 'reading-time-estimate';
    readingTimeElement.innerHTML = `<i class="far fa-clock"></i> 预计阅读时间：${readingTime}分钟`;
    readingTimeElement.style.cssText = `
        position: fixed;
        top: 220px;
        right: 20px;
        padding: 10px 15px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border-radius: 25px;
        font-size: 0.9rem;
        z-index: 1000;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(readingTimeElement);
}

// 通知系统
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #333;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        animation: fadeInOut 2s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// 文章内搜索
function setupArticleSearch() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'article-search';
    searchContainer.innerHTML = `
        <input type="text" placeholder="在文章中搜索..." id="article-search-input">
        <button id="article-search-btn"><i class="fas fa-search"></i></button>
    `;
    searchContainer.style.cssText = `
        position: fixed;
        top: 270px;
        right: 20px;
        display: flex;
        align-items: center;
        background: white;
        border: 1px solid #ddd;
        border-radius: 25px;
        overflow: hidden;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    `;
    
    const input = searchContainer.querySelector('#article-search-input');
    input.style.cssText = `
        border: none;
        padding: 10px 15px;
        outline: none;
        width: 150px;
    `;
    
    const button = searchContainer.querySelector('#article-search-btn');
    button.style.cssText = `
        border: none;
        background: #2563eb;
        color: white;
        padding: 10px 15px;
        cursor: pointer;
    `;
    
    document.body.appendChild(searchContainer);
    
    let searchIndex = 0;
    let searchResults = [];
    
    function searchInArticle(query) {
        if (!query) {
            clearHighlights();
            return;
        }
        
        const articleText = document.querySelector('.article-body');
        const text = articleText.innerHTML;
        
        // 清除之前的高亮
        clearHighlights();
        
        // 搜索并高亮
        const regex = new RegExp(`(${query})`, 'gi');
        const newText = text.replace(regex, '<mark class="search-highlight">$1</mark>');
        articleText.innerHTML = newText;
        
        // 获取所有匹配结果
        searchResults = articleText.querySelectorAll('.search-highlight');
        searchIndex = 0;
        
        if (searchResults.length > 0) {
            searchResults[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    function clearHighlights() {
        const highlights = document.querySelectorAll('.search-highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
    }
    
    input.addEventListener('input', function() {
        searchInArticle(this.value);
    });
    
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchResults.length > 0) {
                searchIndex = (searchIndex + 1) % searchResults.length;
                searchResults[searchIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// 邮箱验证
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    highlightCode();
    generateTableOfContents();
    setupShareButtons();
    setupCommentSystem();
    setupPrintButton();
    setupBookmarkFeature();
    estimateReadingTime();
    setupArticleSearch();
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// 打印样式优化
window.addEventListener('beforeprint', function() {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', function() {
    document.body.classList.remove('printing');
});

// 性能优化：延迟加载图片
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + P 打印
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
    }
    
    // Ctrl/Cmd + F 搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('#article-search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // ESC 关闭搜索
    if (e.key === 'Escape') {
        const searchInput = document.querySelector('#article-search-input');
        if (searchInput) {
            searchInput.value = '';
            searchInput.blur();
            const highlights = document.querySelectorAll('.search-highlight');
            highlights.forEach(highlight => {
                const parent = highlight.parentNode;
                parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
                parent.normalize();
            });
        }
    }
});

// 初始化延迟加载
document.addEventListener('DOMContentLoaded', lazyLoadImages);