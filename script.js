(function () {
  const form = document.getElementById("inquiry-form");
  if (!form) return;

  /* 1. 문의 대상 집
     영상 설명란 링크의 ?h=034 로만 채워진다. 사용자는 입력하지 않는다.
     이름은 houses.js의 카탈로그에서 찾고, 없으면 번호만 보여준다. */
  const houseBlock = document.getElementById("house-block");
  const houseValue = document.getElementById("house-value");
  const codeField = document.getElementById("house-code");

  const params = new URLSearchParams(window.location.search);
  const code = (params.get("h") || params.get("house") || "")
    .trim()
    .replace(/[^0-9A-Za-z-]/g, "")
    .slice(0, 8);

  const catalog = window.LEEJIPSA_HOUSES || {};
  const houseName = code ? catalog[code] : "";
  const houseLabel = code ? (houseName ? `${code}번 · ${houseName}` : `${code}번 집`) : "";

  if (code) {
    codeField.value = code;
    houseValue.textContent = houseLabel;
    houseBlock.hidden = false;
  }

  /* 2. 연락처 자동 하이픈 */
  const nameInput = document.getElementById("name");
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

  /* 4. 접수번호: LJ-260902-4821 */
  const makeReceiptNo = () => {
    const now = new Date();
    const p = (n) => String(n).padStart(2, "0");
    const ymd = `${String(now.getFullYear()).slice(2)}${p(now.getMonth() + 1)}${p(now.getDate())}`;
    const rand = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
    return `LJ-${ymd}-${rand}`;
  };

  /* 5. 접수 */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!nameInput.value.trim()) {
      nameInput.focus();
      alert("이름을 입력해주세요.");
      return;
    }

    if (phone.value.replace(/\D/g, "").length < 10) {
      phone.focus();
      alert("연락처를 정확히 입력해주세요.");
      return;
    }

    const interests = Array.from(
      form.querySelectorAll('input[name="interest"]:checked')
    ).map((el) => el.value);
    if (interests.length === 0) {
      alert("관심 있는 부분을 하나 이상 선택해주세요.");
      return;
    }

    if (!document.getElementById("agree").checked) {
      alert("개인정보 수집·이용에 동의해주세요.");
      return;
    }

    const receiptNo = makeReceiptNo();
    const data = {
      receiptNo,
      houseCode: code,
      houseName: houseName || "",
      name: nameInput.value.trim(),
      phone: phone.value,
      interest: interests.join(", "),
      budget: document.getElementById("budget").value,
      region: document.getElementById("region").value,
      question: document.getElementById("question").value.trim(),
      submittedAt: new Date().toISOString(),
      pageUrl: window.location.href,
    };

    // TODO: 실제 전송(구글 시트 / 메일 / 알림톡)으로 교체
    console.log("이 집 문의", data);

    /* 6. 완료 화면 */
    document.getElementById("receipt-no").textContent = receiptNo;
    const doneHouse = document.getElementById("done-house");
    if (houseLabel) {
      doneHouse.textContent = `문의하신 집 · ${houseLabel}`;
      doneHouse.hidden = false;
    }
    form.hidden = true;
    document.getElementById("done").hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
