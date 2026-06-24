const shareButton = document.querySelector("#shareButton");
const toast = document.querySelector("#toast");

const pageTitle = "مطعم فرن الحارة";
const pageText = "روابط الطلب والموقع والتواصل لمطعم فرن الحارة.";
const orderUrl = "https://6lb.menu/furnalhara";

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

async function copyShareText() {
  const shareUrl = window.location.href.startsWith("file:")
    ? orderUrl
    : window.location.href;
  const text = `${pageTitle}\n${pageText}\n${shareUrl}`;

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

shareButton.addEventListener("click", async () => {
  const shareUrl = window.location.href.startsWith("file:")
    ? orderUrl
    : window.location.href;
  const shareData = {
    title: pageTitle,
    text: pageText,
    url: shareUrl
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await copyShareText();
    showToast("تم نسخ رابط الصفحة");
  } catch (error) {
    if (error.name === "AbortError") return;

    try {
      await copyShareText();
      showToast("تم نسخ رابط الصفحة");
    } catch {
      showToast("تعذر نسخ الرابط");
    }
  }
});
