'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'ปิดเมนู' : 'เปิดเมนู');
  });
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  // Interactive collection process
  const steps = [
    {title:'ตั้งคำถามให้ชัดเจน', description:'คำถามที่ดีช่วยกำหนดทิศทางของการเก็บข้อมูล และทำให้เราเลือกข้อมูลที่จำเป็นได้ตรงจุด', symbol:'?'},
    {title:'เลือกแหล่งข้อมูล', description:'พิจารณาว่าควรเก็บข้อมูลใหม่ด้วยตนเอง หรือใช้ข้อมูลที่มีผู้รวบรวมไว้อยู่แล้ว', symbol:'⌖'},
    {title:'เก็บข้อมูลอย่างเป็นระบบ', description:'เลือกเครื่องมือและวิธีเก็บข้อมูลที่เหมาะสม กำหนดกลุ่มตัวอย่าง และบันทึกข้อมูลให้เป็นรูปแบบเดียวกัน', symbol:'＋'},
    {title:'ตรวจสอบก่อนนำไปใช้', description:'สำรวจข้อมูลที่หายไป ข้อมูลซ้ำ ค่าผิดปกติ และตรวจว่าข้อมูลตรงกับวัตถุประสงค์หรือไม่', symbol:'✓'}
  ];
  let currentStep = 0;
  const stepItems = [...document.querySelectorAll('.process-item')];
  const stepTitle = document.getElementById('stepTitle');
  const stepDescription = document.getElementById('stepDescription');
  const stepCount = document.getElementById('stepCount');
  const targetRing = document.querySelector('.target-ring');
  const progressBars = [...document.querySelectorAll('.step-progress i')];
  const prevStep = document.getElementById('prevStep');
  const nextStep = document.getElementById('nextStep');
  function showStep(index) {
    currentStep = Math.max(0, Math.min(steps.length - 1, index));
    const step = steps[currentStep];
    stepTitle.textContent = step.title;
    stepDescription.textContent = step.description;
    stepCount.textContent = String(currentStep + 1).padStart(2, '0');
    targetRing.textContent = step.symbol;
    stepItems.forEach((item, i) => item.classList.toggle('active', i === currentStep));
    progressBars.forEach((bar, i) => bar.classList.toggle('filled', i <= currentStep));
    prevStep.disabled = currentStep === 0;
    nextStep.disabled = currentStep === steps.length - 1;
  }
  stepItems.forEach(item => item.addEventListener('click', () => showStep(Number(item.dataset.step))));
  prevStep.addEventListener('click', () => showStep(currentStep - 1));
  nextStep.addEventListener('click', () => showStep(currentStep + 1));

  // Live descriptive statistics calculator
  const originalScores = [6, 8, 7, 9, 5, 8, 6];
  let scores = [...originalScores];
  const scoreChips = document.getElementById('scoreChips');
  const meanResult = document.getElementById('meanResult');
  const medianResult = document.getElementById('medianResult');
  const modeResult = document.getElementById('modeResult');
  const scoreInput = document.getElementById('scoreInput');
  const calcFeedback = document.getElementById('calcFeedback');
  function calculateStats() {
    scoreChips.replaceChildren(...scores.map(score => {
      const chip = document.createElement('span');
      chip.textContent = score;
      return chip;
    }));
    const sorted = [...scores].sort((a, b) => a - b);
    const mean = scores.reduce((sum, value) => sum + value, 0) / scores.length;
    const middle = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
    const counts = new Map();
    sorted.forEach(value => counts.set(value, (counts.get(value) || 0) + 1));
    const maxCount = Math.max(...counts.values());
    const modes = [...counts].filter(([, count]) => count === maxCount).map(([value]) => value);
    meanResult.textContent = mean.toFixed(2);
    medianResult.textContent = Number.isInteger(median) ? String(median) : median.toFixed(1);
    modeResult.textContent = maxCount === 1 ? 'ไม่มี' : modes.join(', ');
  }
  document.getElementById('addScore').addEventListener('click', () => {
    const value = Number(scoreInput.value);
    if (scoreInput.value.trim() === '' || !Number.isInteger(value) || value < 0 || value > 10) {
      calcFeedback.textContent = 'กรุณากรอกคะแนนเป็นจำนวนเต็มตั้งแต่ 0 ถึง 10';
      scoreInput.focus();
      return;
    }
    scores.push(value);
    calculateStats();
    calcFeedback.textContent = `เพิ่มคะแนน ${value} แล้ว ขณะนี้มีข้อมูล ${scores.length} ค่า`;
    scoreInput.value = '';
    scoreInput.focus();
  });
  scoreInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') document.getElementById('addScore').click();
  });
  document.getElementById('resetScores').addEventListener('click', () => {
    scores = [...originalScores];
    calculateStats();
    calcFeedback.textContent = 'คืนค่าข้อมูลตัวอย่างเรียบร้อยแล้ว';
    scoreInput.value = '';
  });
  calculateStats();

  // Ten-question knowledge check
  const questions = [
    {q:'ข้อมูลมีคุณค่าเมื่อใดมากที่สุด?',a:['เมื่อมีจำนวนมากที่สุด','เมื่อนำมาวิเคราะห์และใช้ตอบคำถามได้','เมื่อเก็บไว้โดยไม่เปลี่ยนแปลง','เมื่อเป็นข้อมูลจากอินเทอร์เน็ตเท่านั้น'],c:1,e:'ข้อมูลจะมีคุณค่าเมื่อผ่านการจัดการและนำไปใช้ประโยชน์ได้อย่างเหมาะสม'},
    {q:'ข้อใดเป็นข้อมูลปฐมภูมิ?',a:['รายงานสถิติจากเว็บไซต์รัฐ','บทความวิจัยที่เผยแพร่แล้ว','คำตอบจากแบบสอบถามที่เราเก็บเอง','ข้อมูลสำมะโนประชากรที่เผยแพร่'],c:2,e:'ข้อมูลปฐมภูมิเป็นข้อมูลที่ผู้ศึกษารวบรวมจากแหล่งกำเนิดโดยตรง'},
    {q:'สิ่งใดควรทำเป็นอันดับแรกก่อนเก็บรวบรวมข้อมูล?',a:['สร้างกราฟ','กำหนดคำถามและวัตถุประสงค์','คำนวณค่าเฉลี่ย','เขียนสรุปผล'],c:1,e:'การกำหนดคำถามทำให้รู้ว่าต้องการข้อมูลอะไรและจะเก็บอย่างไร'},
    {q:'การตรวจสอบข้อมูลซ้ำและค่าที่หายไปเป็นส่วนหนึ่งของขั้นตอนใด?',a:['การทำความสะอาดข้อมูล','การเผยแพร่ข้อมูล','การสร้างแบบจำลองภาพ','การตั้งชื่อกราฟ'],c:0,e:'การทำความสะอาดข้อมูลช่วยลดข้อผิดพลาดก่อนวิเคราะห์'},
    {q:'คะแนน 4, 6, 6, 8, 10 มีค่าเฉลี่ยเท่าใด?',a:['6','6.8','7','8'],c:1,e:'ค่าเฉลี่ย = (4 + 6 + 6 + 8 + 10) ÷ 5 = 6.8'},
    {q:'จากข้อมูล 3, 5, 7, 9, 11 ค่ามัธยฐานคือเท่าใด?',a:['5','7','8','9'],c:1,e:'มัธยฐานคือค่าตรงกลางเมื่อเรียงข้อมูลจากน้อยไปมาก'},
    {q:'หากต้องการเปรียบเทียบจำนวนผู้ใช้บริการแต่ละวัน ควรใช้กราฟใด?',a:['กราฟแท่ง','แผนภูมิวงกลมเท่านั้น','ภาพถ่าย','แผนผังความคิด'],c:0,e:'กราฟแท่งเหมาะสำหรับเปรียบเทียบปริมาณระหว่างหมวดหมู่'},
    {q:'กราฟเส้นเหมาะกับการนำเสนอข้อมูลลักษณะใด?',a:['สัดส่วนของทั้งก้อน','แนวโน้มที่เปลี่ยนแปลงตามเวลา','รายชื่อบุคคล','ข้อความยาว ๆ'],c:1,e:'กราฟเส้นช่วยให้เห็นทิศทางและแนวโน้มของข้อมูลตามเวลา'},
    {q:'ข้อใดเป็นการใช้ข้อมูลอย่างมีจริยธรรม?',a:['เผยแพร่ชื่อและเบอร์โทรของผู้ตอบ','นำข้อมูลไปใช้คนละวัตถุประสงค์โดยไม่ขออนุญาต','เก็บเท่าที่จำเป็นและปกป้องข้อมูลส่วนบุคคล','แก้ไขตัวเลขเพื่อให้กราฟดูดี'],c:2,e:'ควรเก็บข้อมูลเท่าที่จำเป็น ขออนุญาต และรักษาความเป็นส่วนตัว'},
    {q:'องค์ประกอบใดช่วยให้ผู้อ่านเข้าใจกราฟได้ถูกต้อง?',a:['ใช้สีให้มากที่สุด','ตัดหน่วยและแหล่งที่มาออก','ไม่ต้องมีชื่อกราฟ','มีชื่อกราฟ หน่วย และแหล่งที่มา'],c:3,e:'ชื่อกราฟ หน่วย ป้ายกำกับ และแหล่งที่มาช่วยให้ตีความข้อมูลได้ถูกต้อง'}
  ];
  let questionIndex = 0;
  let selectedAnswer = null;
  let answers = [];
  const questionNumber = document.getElementById('questionNumber');
  const questionText = document.getElementById('questionText');
  const answerList = document.getElementById('answerList');
  const nextQuestion = document.getElementById('nextQuestion');
  const answerHint = document.getElementById('answerHint');
  const quizProgressText = document.getElementById('quizProgressText');
  const quizProgressBar = document.getElementById('quizProgressBar');
  const quizContent = document.getElementById('quizContent');
  const resultPanel = document.getElementById('resultPanel');
  const letters = ['A', 'B', 'C', 'D'];
  function renderQuestion() {
    const item = questions[questionIndex];
    selectedAnswer = null;
    questionNumber.textContent = String(questionIndex + 1).padStart(2, '0');
    quizProgressText.textContent = `QUESTION ${String(questionIndex + 1).padStart(2, '0')} / ${questions.length}`;
    quizProgressBar.style.width = `${(questionIndex / questions.length) * 100}%`;
    questionText.textContent = item.q;
    answerHint.textContent = 'เลือกคำตอบที่ถูกต้องที่สุด 1 ข้อ';
    nextQuestion.disabled = true;
    nextQuestion.innerHTML = questionIndex === questions.length - 1 ? 'ดูผลคะแนน ↗' : 'ยืนยันคำตอบ →';
    answerList.replaceChildren();
    item.a.forEach((answer, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-option';
      button.innerHTML = `<span class="option-letter">${letters[index]}</span><span></span>`;
      button.querySelector('span:last-child').textContent = answer;
      button.addEventListener('click', () => {
        selectedAnswer = index;
        answerList.querySelectorAll('button').forEach((option, i) => option.classList.toggle('selected', i === index));
        nextQuestion.disabled = false;
        answerHint.textContent = 'เลือกคำตอบแล้ว กดยืนยันเพื่อดูผล';
      });
      answerList.appendChild(button);
    });
  }
  nextQuestion.addEventListener('click', () => {
    if (selectedAnswer === null) return;
    answers[questionIndex] = selectedAnswer;
    const item = questions[questionIndex];
    const options = [...answerList.querySelectorAll('button')];
    options.forEach((option, index) => {
      option.disabled = true;
      if (index === item.c) option.classList.add('correct');
      else if (index === selectedAnswer) option.classList.add('wrong');
    });
    answerHint.textContent = selectedAnswer === item.c ? `ถูกต้อง! ${item.e}` : `ยังไม่ถูกต้อง: ${item.e}`;
    if (questionIndex < questions.length - 1) {
      nextQuestion.disabled = false;
      nextQuestion.textContent = 'ข้อต่อไป →';
      nextQuestion.onclick = () => {
        questionIndex += 1;
        nextQuestion.onclick = null;
        renderQuestion();
      };
    } else {
      nextQuestion.disabled = false;
      nextQuestion.textContent = 'ดูผลคะแนน ↗';
      nextQuestion.onclick = () => {
        showResults();
        nextQuestion.onclick = null;
      };
    }
  });
  function showResults() {
    const score = answers.reduce((total, answer, index) => total + (answer === questions[index].c ? 1 : 0), 0);
    quizContent.hidden = true;
    resultPanel.hidden = false;
    quizProgressText.textContent = 'COMPLETED';
    quizProgressBar.style.width = '100%';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('resultMessage').textContent = score === 10 ? 'ยอดเยี่ยม! คุณเข้าใจเรื่องข้อมูลมีคุณค่าอย่างครบถ้วน' : score >= 7 ? 'ทำได้ดีมาก! ลองทบทวนคำอธิบายเพื่อให้แม่นยำยิ่งขึ้น' : score >= 5 ? 'ทำได้ดีในระดับหนึ่ง กลับไปทบทวนบทเรียนแล้วลองอีกครั้งนะ' : 'ไม่เป็นไร ลองกลับไปเรียนรู้ทีละหัวข้อ แล้วกลับมาทดสอบใหม่';
  }
  document.getElementById('retryQuiz').addEventListener('click', () => {
    questionIndex = 0;
    answers = [];
    resultPanel.hidden = true;
    quizContent.hidden = false;
    nextQuestion.onclick = null;
    renderQuestion();
  });
  renderQuestion();
});
