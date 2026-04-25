<template>
    <Teleport to="body">
        <div class="modal d-block" style="background: rgba(0,0,0,0.5)" @mousedown.self="$emit('close')"
            @keydown.esc="$emit('close')" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content shadow">
                    <div class="modal-header">
                        <h5 class="modal-title">Report Podcast</h5>
                        <button type="button" class="btn-close" @click="$emit('close')"></button>
                    </div>
                    <div class="modal-body">
                        <div v-if="success" class="text-center py-4">
                            <i class="fa-solid fa-circle-check text-success display-4 mb-3"></i>
                            <p>Report Submitted. Thank you for helping us improve PodStream.</p>
                            <button class="btn btn-primary" @click="$emit('close')">Close</button>
                        </div>
                        <form v-else @submit.prevent="handleSubmit">
                            <div class="mb-3">
                                <label class="form-label fw-bold">Reason *</label>
                                <div v-for="reason in reasons" :key="reason" class="form-check">
                                    <input class="form-check-input" type="radio" :value="reason" v-model="form.reason"
                                        @blur="errors.reason = true">
                                    <label class="form-check-label">{{ reason }}</label>
                                </div>
                                <small v-if="errors.reason && !validation.reason" class="text-danger">Selection
                                    required</small>
                            </div>

                            <div v-if="form.reason === 'Other'" class="mb-3">
                                <label class="form-label">Description *</label>
                                <textarea class="form-control" v-model.trim="form.description"
                                    @blur="errors.description = true"></textarea>
                                <div class="d-flex justify-content-between mt-1">
                                    <small :class="{ 'text-danger': form.description.length > 500 }">{{
                                        form.description.length }} / 500</small>
                                    <small v-if="errors.description && !validation.description" class="text-danger">Must
                                        be 20-500 characters</small>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Email (Optional)</label>
                                <input type="email" class="form-control" v-model.trim="form.email"
                                    @blur="errors.email = true">
                                <small v-if="errors.email && !validation.email" class="text-danger">Invalid email
                                    format</small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold">Severity *</label>
                                <div class="btn-group w-100">
                                    <button v-for="sev in ['Low', 'Medium', 'High']" :key="sev" type="button"
                                        class="btn btn-sm"
                                        :class="form.severity === sev ? 'btn-primary' : 'btn-outline-primary'"
                                        @click="form.severity = sev; errors.severity = true">
                                        {{ sev }}
                                    </button>
                                </div>
                                <small v-if="errors.severity && !validation.severity"
                                    class="text-danger d-block mt-1">Required</small>
                            </div>

                            <div class="mb-3 form-check">
                                <input class="form-check-input" type="checkbox" v-model="form.agreement" id="agree"
                                    @change="errors.agreement = true">
                                <label class="form-check-label" for="agree">I confirm this report is accurate...</label>
                                <small v-if="errors.agreement && !validation.agreement"
                                    class="text-danger d-block">Required</small>
                            </div>

                            <button type="submit" class="btn btn-danger w-100" :disabled="!isValid || loading">
                                <span v-if="loading" class="spinner-border spinner-border-sm"></span>
                                Submit Report
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, inject, onUnmounted } from 'vue';
import { useReportStore } from '@/store/reportStore';

const podcastId = inject('podcastId') as number;
const emit = defineEmits(['close']);
const reportStore = useReportStore();

const loading = ref(false);
const success = ref(false);
const reasons = ["Inappropriate Content", "Copyright Violation", "Spam / Misleading", "Audio Quality Issues", "Other"];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialState = {
    reason: '',
    description: '',
    email: '',
    severity: '',
    agreement: false
};

const initialErrors = {
    reason: false,
    description: false,
    email: false,
    severity: false,
    agreement: false
};

const form = reactive({ ...initialState });
const errors = reactive({ ...initialErrors });

const validation = computed(() => ({
    reason: form.reason !== '', 
    description: form.reason !== 'Other' || (form.description.length >= 20 && form.description.length <= 500),
    email: !form.email || emailRegex.test(form.email),
    severity: form.severity !== '',
    agreement: form.agreement === true
}));

const isValid = computed(() => Object.values(validation.value).every(v => v));

const resetForm = (): void => {
    Object.assign(form, initialState);
    Object.assign(errors, initialErrors);
    loading.value = false;
    success.value = false;
};

async function handleSubmit(): Promise<void> {
    (Object.keys(errors) as Array<keyof typeof errors>).forEach(key => errors[key] = true); // Show all errors if invalid

    if (!isValid.value) return;

    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    reportStore.addReport({
        podcastId,
        ...form
    });
    loading.value = false;
    success.value = true;
}

onUnmounted(() => {
    resetForm();
});
</script>