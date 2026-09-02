(function () {
  const form = document.getElementById("inquiry-form");
  if (!form) return;

  /* 1. 문의 대상 집 코드
     영상 설명란 링크에 ?h=034 형태로 집 번호를 달아두면 자동으로 기록된다.
     파라미터가 없으면 직접 입력 칸을 보여준다. */
  const codeField = document.getElementById("house-code");
  const knownBox = document.getElementById("house-known");
  const unknownBox = document.getElementById("house-unknown");
  const codeView = document.getElementById("house-code-view");
  const codeInput = document.getElementById("house-code-input");

  const params = new URLSearchParams(window.location.search);
  const rawCode = (params.get("h") || params.get("house") || "").trim();
  const code = rawCode.replace(/[^0-9A-Za-z\-]/g, "").slice(0, 8);

  if (code) {
    codeField.value = code;
    codeView.textContent = `#${code}`;
    knownBox.hidden = false;
    unknownBox.hidden = true;
    codeInput.removeAttribute("name");
  } else {
    codeInput.addEventListener("input", (e) => {
      codeField.value = e.target.value.trim();
    });
  }

  /* 2. 연락처 자동 하이픈 */
  const phone = document.getElementById("phone");
  const formatPhone = (raw) => {
    const d = raw.replace(/\D/g, "").slice(0, 11);
    if (d.length < 4) return d;
    if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
    if (d.length <= 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  };
  phone.addEventListener("input", (e) => {
    e.target.value = formatPhone(e.target.value);
  });

  /* 3. 관심 항목 선택 표시 (:has 미지원 브라우저 대비) */
  const choices = Array.from(document.querySelectorAll(".choice"));
  const paintChoices = () => {
    choices.forEach((el) => {
      const input = el.querySelector("input");
      el.classList.toggle("is-selected", !!input && input.checked);
    });
  };
  choices.forEach((el) => el.addEventListener("change", paintChoices));
  paintChoices();

  /* 4. 접수 */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!phone.value || phone.value.replace(/\D/g, "").length < 10) {
      phone.focus();
      alert("연락처를 정확히 입력해주세요.");
      return;
    }

    const interest = form.querySelector('input[name="interest"]:checked');
    if (!interest) {
      alert("관심 있는 부분을 선택해주세요.");
      return;
    }

    const agree = document.getElementById("agree");
    if (!agree.checked) {
      alert("개인정보 수집·이용에 동의해주세요.");
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    data.houseCode = codeField.value || "";
    data.submittedAt = new Date().toISOString();
    data.pageUrl = window.location.href;

    // TODO: 실제 전송(구글 시트 / 메일 / 알림톡)으로 교체
    console.log("이 집 문의", data);

    const label = data.houseCode ? `${data.houseCode}번 집` : "문의";
    alert(`${label} 문의가 접수되었습니다.\n확인 후 연락드리겠습니다.`);
    form.reset();
    paintChoices();
  });
})();
