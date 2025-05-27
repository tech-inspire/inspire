<template>
  <div class="modal-overlay" @click.self="cancel">
    <div class="modal">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <div class="modal-actions">
        <button class="confirm-button" @click="$emit('confirm')">Yes</button>
        <button class="cancel-button" @click="$emit('cancel')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    title: {
      type: String,
      default: 'Confirm',
    },
    message: {
      type: String,
      default: 'Are you sure?',
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: var(--color-background-soft);
  border-radius: 10px;
  padding: 20px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.confirm-button {
  background-color: #e74c3c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  transition: transform 0.3s ease;
}
.confirm-button:hover {
  transform: scale(1.1);
}


.cancel-button {
  background-color: #ccc;
  color: black;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  transition: transform 0.3s ease;
}
.cancel-button:hover {
  transform: scale(1.1);
}
</style>
