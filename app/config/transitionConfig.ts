export const TRANSITION_CONFIG = {
  // Asset Paths for preprocessed WebP image sequences
  HORIZONTAL_VIDEO_PATH: "/sequence/horizontal/",
  VERTICAL_VIDEO_PATH: "/sequence/vertical/",

  // Frame prefixes and counts
  FRAME_PREFIX: "frame_",
  TOTAL_FRAMES_HORIZONTAL: 300,
  TOTAL_FRAMES_VERTICAL: 300,
  INITIAL_CRITICAL_FRAMES: 20, // Load first 20 frames immediately for < 1.0s splash curtain dismiss

  // Responsive Breakpoint (px)
  // < 768px: Mobile Vertical Experience
  // >= 768px: Desktop Horizontal Experience
  DESKTOP_BREAKPOINT: 768,

  // Scroll Distance (in vh) for pinned sticky transition sections
  SCROLL_DISTANCE_DESKTOP: 450, // 450vh gives cinematic breathing room on desktop
  SCROLL_DISTANCE_MOBILE: 350,  // 350vh gives natural touch swipe breathing room on mobile

  // RAF Interpolation Damping Factors (lerp coefficient)
  // Lower = smoother/more weighted, Higher = faster immediate response
  SMOOTHING_DESKTOP: 0.08,
  SMOOTHING_MOBILE: 0.095,

  // Section Pin Range (0.0 to 0.85 progress reserved for scrub, 0.85 to 1.0 for hero text & exit)
  ANIMATION_END_PROGRESS: 0.85,
};
