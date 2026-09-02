(function () {
  const form = document.getElementById("reservation-form");
  if (!form) return;

  const dateInput = document.getElementById("visit-date");
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  const phone = document.getElementById("phone");
  if (phone) {
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
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const required = ["name", "phone", "visit-date", "visit-time", "visitors"];
    for (const id of required) {
      const el = document.getElementById(id);
      if (el && !el.value) {
        el.focus();
        alert("필수 항목을 입력해주세요.");
        return;
      }
    }

    const agree = document.getElementById("agree");
    if (!agree.checked) {
      alert("개인정보 수집·이용에 동의해주세요.");
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    console.log("방문예약 데이터", data);
    alert("방문예약이 접수되었습니다.\n상담 후 연락드리겠습니다.");
    form.reset();
  });
})();
