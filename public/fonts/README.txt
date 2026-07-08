여기에 LaundryGothic 폰트 파일을 넣어주세요.

파일명(둘 중 하나 또는 둘 다):
  - LaundryGothic.woff2   (권장, 용량 작음)
  - LaundryGothic.otf

index.css 의 @font-face 가 아래 순서로 폰트를 찾습니다:
  1) 시스템에 설치된 'LaundryGothicOTF' / 'Laundry Gothic' / '런드리고딕'
  2) /fonts/LaundryGothic.woff2
  3) /fonts/LaundryGothic.otf
  4) (없으면) Apple SD Gothic Neo / Malgun Gothic 폴백

파일을 넣고 개발 서버를 새로고침하면 바로 적용됩니다.
.otf 만 있다면 woff2 로 변환하면 로딩이 더 빠릅니다(선택).
