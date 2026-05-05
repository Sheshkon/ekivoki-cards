  <script setup>
  defineProps({
    card: Object
  });
  </script>

  <template>
    <div class="special-task">
      <div class="special-label">
        {{ $t('special_task.label') }}
      </div>
      <div class="special-text">
        {{ card.dice6?.phrase || $t('special_task.no_task') }}
      </div>
      <div class="special-type" v-if="card.dice6?.type">
        {{ $t('special_task.type') }} {{ card.dice6.type }}
      </div>
      <div class="special-comments" v-if="card.comments">
        {{ card.comments }}
      </div>
      <div class="special-author" v-if="card.author">
        {{ $t('special_task.author') }} {{ card.author }}
      </div>
    </div>
  </template>

  <style scoped>
  .special-task {
    text-align: center;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0;
    gap: clamp(0.16rem, 0.7vh, 0.4rem);
    min-height: 0;
    overflow-wrap: anywhere;
    word-break: break-word;
    line-height: 1.2;
  }
  .special-label {
    font-weight: bold;
    color: var(--color-purple);
    padding-bottom: clamp(0.1rem, 0.4vh, 0.25rem);
    font-size: clamp(0.78rem, 1.5vw, 0.95rem);
  }
  .special-text {
    font-weight: 700;
    color: var(--color-text);
    font-size: clamp(0.8rem, 1.7vw, 1rem);
  }
  .special-type {
    font-style: italic;
    font-size: clamp(0.64rem, 1.2vw, 0.8rem);
  }
  .special-comments {
    font-style: oblique;
    font-size: clamp(0.64rem, 1.2vw, 0.8rem);
    margin-top: clamp(0.12rem, 0.5vh, 0.28rem);
  }
  .special-author {
    font-size: clamp(0.6rem, 1vw, 0.75rem);
    margin-top: clamp(0.12rem, 0.5vh, 0.28rem);
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    .special-label {
      font-size: clamp(0.7rem, 1.02vw, 0.82rem);
    }
    .special-text {
      font-size: clamp(0.72rem, 1.1vw, 0.86rem);
    }
    .special-type,
    .special-comments {
      font-size: clamp(0.58rem, 0.84vw, 0.7rem);
    }
    .special-author {
      font-size: clamp(0.56rem, 0.76vw, 0.66rem);
    }
  }

  @media (min-width: 1025px) and (max-width: 1279px) {
    .special-label {
      font-size: clamp(0.66rem, 0.86vw, 0.76rem);
    }
    .special-text {
      font-size: clamp(0.68rem, 0.92vw, 0.8rem);
    }
    .special-type,
    .special-comments {
      font-size: clamp(0.54rem, 0.7vw, 0.62rem);
    }
    .special-author {
      font-size: clamp(0.52rem, 0.64vw, 0.6rem);
    }
  }

  @media (min-width: 1280px) {
    .special-label {
      font-size: clamp(0.68rem, 0.74vw, 0.8rem);
    }
    .special-text {
      font-size: clamp(0.7rem, 0.8vw, 0.84rem);
    }
    .special-type,
    .special-comments {
      font-size: clamp(0.56rem, 0.62vw, 0.64rem);
    }
    .special-author {
      font-size: clamp(0.54rem, 0.58vw, 0.62rem);
    }
  }
  </style>
